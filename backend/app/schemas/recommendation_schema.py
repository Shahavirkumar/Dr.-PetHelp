from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

CategoryType = Literal["Diet", "Grooming", "Hygiene", "Exercise", "Wellness", "Symptoms"]


class RecommendationCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    content: str = Field(..., min_length=1)
    category: CategoryType
    pet_id: Optional[str] = None


class RecommendationResponse(BaseModel):
    id: str
    title: str
    content: str
    category: CategoryType
    pet_id: Optional[str] = None
    created_at: datetime