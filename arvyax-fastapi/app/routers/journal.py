from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.journal import JournalEntry
from app.schemas.schemas import JournalCreate, JournalOut, AnalyzeRequest, AnalysisOut, InsightsOut
from app.services import journal_service, groq_service
from app.services.cache import get_cached, set_cached
from collections import Counter
import json

router = APIRouter(prefix="/api/journal", tags=["journal"])


@router.post("", response_model=JournalOut, status_code=201)
async def create_journal(
    body: JournalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = await journal_service.create_entry(db, current_user.id, body.ambience, body.text)
    return entry


@router.get("/insights/{user_id}", response_model=InsightsOut)
async def get_insights(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied.")
    entries = await journal_service.get_entries_with_analysis(db, user_id)
    if not entries:
        return InsightsOut(totalEntries=0, topEmotion=None, mostUsedAmbience=None, recentKeywords=[])
    emotions = [e.analysis.emotion for e in entries if e.analysis]
    top_emotion = Counter(emotions).most_common(1)[0][0] if emotions else None
    most_used_ambience = Counter(e.ambience for e in entries).most_common(1)[0][0]
    recent_keywords = list(
        dict.fromkeys(kw for e in entries[:5] if e.analysis for kw in e.analysis.keywords)
    )[:10]
    return InsightsOut(
        totalEntries=len(entries),
        topEmotion=top_emotion,
        mostUsedAmbience=most_used_ambience,
        recentKeywords=recent_keywords,
    )


@router.post("/analyze", response_model=AnalysisOut)
async def analyze(
    body: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cached = get_cached(body.text)
    if cached:
        result = cached
    else:
        result = await groq_service.analyze_emotion(body.text)
        set_cached(body.text, result)
    if body.entryId:
        await journal_service.save_analysis(db, body.entryId, **result)
    return result


@router.get("/{user_id}", response_model=list[JournalOut])
async def get_journals(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied.")
    return await journal_service.get_entries(db, user_id)