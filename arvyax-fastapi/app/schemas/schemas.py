from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ── Auth ──────────────────────────────────────────────
class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    model_config = {"from_attributes": True}

# ── Journal ───────────────────────────────────────────
class JournalCreate(BaseModel):
    userId: str
    ambience: str
    text: str

class AnalysisOut(BaseModel):
    emotion: str
    keywords: list[str]
    summary: str
    model_config = {"from_attributes": True}

class JournalOut(BaseModel):
    id: int
    user_id: int
    ambience: str
    text: str
    created_at: datetime
    model_config = {"from_attributes": True}

# ── Analyze ───────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    text: str
    entryId: Optional[int] = None

# ── Insights ──────────────────────────────────────────
class InsightsOut(BaseModel):
    totalEntries: int
    topEmotion: Optional[str]
    mostUsedAmbience: Optional[str]
    recentKeywords: list[str]