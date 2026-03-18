from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from beanie import PydanticObjectId

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
        populate_by_name = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str

