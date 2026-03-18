from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder

from app.api import deps
from app.crud import user as crud_user
from app.models.user import User as UserModel
from app.schemas.user import User, UserCreate, UserUpdate

router = APIRouter()

@router.post("/", response_model=User)
async def create_user(
    *,
    user_in: UserCreate,
) -> Any:
    """
    Create new user without requiring authentication.
    """
    print(f"DEBUG: create_user called with email: {user_in.email}")
    user = await crud_user.get_user_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = await crud_user.create_user(user=user_in)
    return user

@router.get("/me", response_model=User)
async def read_user_me(
    current_user: UserModel = Depends(deps.get_current_active_user),
) -> Any:
    return current_user
