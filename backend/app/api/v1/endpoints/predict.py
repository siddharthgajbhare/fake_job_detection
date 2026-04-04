from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.models.user import User
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionCreate, PredictionResponse
from app.services.ml_service import predict_job_post
from typing import List

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def create_prediction(
    *,
    prediction_in: PredictionCreate,
    current_user: User = Depends(get_current_user)
) -> PredictionResponse:
    """
    Predict if a job post is real or fake.
    """
    # Prediction logic
    result, confidence, conf_level, explanation = predict_job_post(
        prediction_in.job_description,
        prediction_in.job_title,
        prediction_in.requirements
    )

    # Save to database
    prediction = Prediction(
        user=current_user,
        job_description=prediction_in.job_description,
        job_title=prediction_in.job_title,
        requirements=prediction_in.requirements,
        prediction_result=result,
        confidence_score=confidence,
        confidence_level=conf_level,
        explanation=explanation
    )
    await prediction.insert()

    return PredictionResponse(
        id=str(prediction.id),
        job_description=prediction.job_description,
        job_title=prediction.job_title,
        requirements=prediction.requirements,
        prediction_result=prediction.prediction_result,
        confidence_score=prediction.confidence_score,
        confidence_level=prediction.confidence_level,
        explanation=prediction.explanation,
        created_at=prediction.created_at
    )

@router.get("/history", response_model=List[PredictionResponse])
async def get_prediction_history(
    current_user: User = Depends(get_current_user)
) -> List[PredictionResponse]:
    """
    Get user's prediction history.
    """
    predictions = await Prediction.find(Prediction.user.id == current_user.id).sort(-Prediction.created_at).to_list()
    
    return [
        PredictionResponse(
            id=str(p.id),
            job_description=p.job_description,
            job_title=p.job_title,
            requirements=p.requirements,
            prediction_result=p.prediction_result,
            confidence_score=p.confidence_score,
            confidence_level=p.confidence_level or "LOW",
            explanation=p.explanation or [],
            created_at=p.created_at
        ) for p in predictions
    ]
