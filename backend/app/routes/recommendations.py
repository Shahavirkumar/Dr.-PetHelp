from fastapi import APIRouter, HTTPException, Depends, status
from typing import List

from app.schemas.recommendation_schema import RecommendationCreate, RecommendationResponse
from app.services import recommendation_service
from app.utils.jwt_handler import get_current_user

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get("", response_model=List[RecommendationResponse])
async def get_recommendations(current_user: dict = Depends(get_current_user)):
    """Get all saved recommendations for the logged-in user."""
    return await recommendation_service.get_recommendations_for_user(current_user["id"])


@router.post("", response_model=RecommendationResponse, status_code=status.HTTP_201_CREATED)
async def save_recommendation(
    payload: RecommendationCreate, current_user: dict = Depends(get_current_user)
):
    """Save a useful AI recommendation."""
    try:
        return await recommendation_service.create_recommendation(current_user["id"], payload)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{recommendation_id}")
async def delete_recommendation(recommendation_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a saved recommendation."""
    deleted = await recommendation_service.delete_recommendation(recommendation_id, current_user["id"])
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommendation not found.")
    return {"message": "Recommendation deleted successfully."}