from typing import Optional
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash

async def get_user(user_id: str) -> Optional[User]:
    return await User.get(user_id)

async def get_user_by_email(email: str) -> Optional[User]:
    return await User.find_one(User.email == email)

async def create_user(user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    await db_user.create()
    return db_user
