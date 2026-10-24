from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional, Literal

from app.models.py_object_id import PyObjectId

SpeciesType = Literal["Dog", "Cat", "Rabbit", "Bird", "Hamster", "Fish", "Other"]
ActivityLevelType = Literal["Low", "Moderate", "High"]


class PetModel(BaseModel):
    """
    Represents a pet document as stored in MongoDB (collection: 'pets').
    Linked to its owner via owner_id.
    """

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    owner_id: PyObjectId
    name: str
    species: SpeciesType
    breed: Optional[str] = None
    age: Optional[float] = None
    gender: Optional[Literal["Male", "Female"]] = None
    weight: Optional[float] = None
    activity_level: Optional[ActivityLevelType] = "Moderate"
    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None
    food_preferences: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }