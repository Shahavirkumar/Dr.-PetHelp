from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional, Literal

from app.models.py_object_id import PyObjectId

CategoryType = Literal["Diet", "Grooming", "Hygiene", "Exercise", "Wellness", "Symptoms"]


class RecommendationModel(BaseModel):
    """
    Represents a saved recommendation document as stored in MongoDB
    (collection: 'recommendations'). Created when a user saves a useful
    AI response from a chat conversation.
    """

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: PyObjectId
    pet_id: Optional[PyObjectId] = None
    title: str
    content: str
    category: CategoryType
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }