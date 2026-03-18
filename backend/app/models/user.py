from typing import Optional
from datetime import datetime
from beanie import Document, Indexed
from pydantic import EmailStr

class User(Document):
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"
