from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionBase(BaseModel):
    job_description: str

class PredictionCreate(PredictionBase):
    pass

class PredictionResponse(BaseModel):
    id: Optional[str] = None
    job_description: Optional[str] = None
    prediction_result: Optional[str] = None
    confidence_score: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True
