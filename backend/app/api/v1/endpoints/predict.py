from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException

from app.api import deps
from app.services.ml_service import predict_job_post
from app.schemas.prediction import PredictionCreate, PredictionResponse
from app.models.prediction import Prediction
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def predict(
    *,
    prediction_in: PredictionCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Predict if a job posting is Fake or Real.
    """
    result, confidence = predict_job_post(prediction_in.job_description)
    
    prediction = Prediction(
        user=current_user,
        job_description=prediction_in.job_description,
        prediction_result=result,
        confidence_score=confidence
    )
    await prediction.create()
    
    return PredictionResponse(
        id=str(prediction.id),
        job_description=prediction.job_description,
        prediction_result=prediction.prediction_result,
        confidence_score=prediction.confidence_score,
        created_at=prediction.created_at
    )

@router.get("/history", response_model=List[PredictionResponse])
async def read_history(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve prediction history for the current user.
    """
    if current_user.is_superuser:
         predictions = await Prediction.find_all().sort("-created_at").skip(skip).limit(limit).to_list()
    else:
        # Beanie Link handling: find by user.id
        predictions = await Prediction.find(Prediction.user.id == current_user.id).sort("-created_at").skip(skip).limit(limit).to_list()
    
    return [
        PredictionResponse(
            id=str(p.id),
            job_description=p.job_description,
            prediction_result=p.prediction_result,
            confidence_score=p.confidence_score,
            created_at=p.created_at
        )
        for p in predictions
    ]
