from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.services.user_service import get_user_by_email, create_user
from app.schemas.schemas import RegisterRequest, LoginRequest, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserOut, status_code=201)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_email(db, body.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = await create_user(db, body.email, body.username, body.password)
    return user

@router.post("/login", response_model=UserOut)
async def login(response: Response, body: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    token = create_access_token({"sub": str(user.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,      
        secure=True,        
        samesite="lax",
        max_age=3600,       
    )
    return user

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}