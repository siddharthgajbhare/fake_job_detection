from typing import Optional
from datetime import datetime
from beanie import Document, Link
from app.models.user import User

class Prediction(Document):
    user: Link[User]
    job_description: str
    prediction_result: str # "Real" or "Fake"
    confidence_score: float
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "predictions"
