from sqlalchemy import Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.core.database import Base

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    ambience: Mapped[str] = mapped_column(String, nullable=False)
    text: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="journals")
    analysis = relationship("Analysis", back_populates="entry", uselist=False, cascade="all, delete")


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    entry_id: Mapped[int] = mapped_column(Integer, ForeignKey("journal_entries.id"), unique=True, nullable=False)
    emotion: Mapped[str] = mapped_column(String, nullable=False)
    keywords: Mapped[list] = mapped_column(JSON, nullable=False)
    summary: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    entry = relationship("JournalEntry", back_populates="analysis")