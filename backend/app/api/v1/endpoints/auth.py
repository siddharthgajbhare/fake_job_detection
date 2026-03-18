from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import logging

from app.api import deps
from app.core import security
from app.core.conf import settings
from app.crud import user as crud_user
from app.schemas.token import Token
from app.schemas.user import User, UserCreate

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=User)
async def register(
    *,
    user_in: UserCreate,
) -> Any:
    """
    Register new user.
    """
    print(f"DEBUG_AUTH: Entering register handler for {user_in.email}")
    user = await crud_user.get_user_by_email(email=user_in.email)
    if user:
        print(f"DEBUG_AUTH: User {user_in.email} already exists")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    print(f"DEBUG_AUTH: Creating new user {user_in.email}")
    user = await crud_user.create_user(user=user_in)
    print(f"DEBUG_AUTH: User {user_in.email} created successfully with ID: {user.id}")
    return user

@router.post("/login", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    logger.info(f"Login attempt for email: {form_data.username}")
    user = await crud_user.get_user_by_email(email=form_data.username)
    
    if not user:
        logger.warning(f"User not found: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    logger.info(f"User found, verifying password...")
    password_valid = security.verify_password(form_data.password, user.hashed_password)
    logger.info(f"Password verification result: {password_valid}")
    
    if not password_valid:
        logger.warning(f"Invalid password for user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        str(user.id), expires_delta=access_token_expires
    )
    logger.info(f"Login successful for: {form_data.username}")
    return {"access_token": access_token, "token_type": "bearer"}
