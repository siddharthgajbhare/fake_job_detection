from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.conf import settings
from app.models.user import User
from app.models.prediction import Prediction

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DB_NAME], document_models=[User, Prediction])
