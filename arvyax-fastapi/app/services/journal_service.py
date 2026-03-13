from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.journal import JournalEntry, Analysis

async def create_entry(db: AsyncSession, user_id: int, ambience: str, text: str) -> JournalEntry:
    entry = JournalEntry(user_id=user_id, ambience=ambience, text=text)
    db.add(entry)
    await db.commit()

    # Re-fetch with analysis eagerly loaded
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.id == entry.id)
        .options(selectinload(JournalEntry.analysis))
    )
    return result.scalar_one()

async def get_entries(db: AsyncSession, user_id: int) -> list[JournalEntry]:
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.user_id == user_id)
        .options(selectinload(JournalEntry.analysis))
        .order_by(JournalEntry.created_at.desc())
    )
    return result.scalars().all()

async def save_analysis(db: AsyncSession, entry_id: int, emotion: str, keywords: list, summary: str) -> Analysis:
    result = await db.execute(select(Analysis).where(Analysis.entry_id == entry_id))
    analysis = result.scalar_one_or_none()
    if analysis:
        analysis.emotion = emotion
        analysis.keywords = keywords
        analysis.summary = summary
    else:
        analysis = Analysis(entry_id=entry_id, emotion=emotion, keywords=keywords, summary=summary)
        db.add(analysis)
    await db.commit()
    await db.refresh(analysis)
    return analysis

async def get_entries_with_analysis(db: AsyncSession, user_id: int) -> list[JournalEntry]:
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.user_id == user_id)
        .options(selectinload(JournalEntry.analysis))
        .order_by(JournalEntry.created_at.desc())
    )
    return result.scalars().all()