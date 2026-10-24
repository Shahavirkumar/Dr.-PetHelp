from pydantic import BaseModel, Field
from typing import Optional, Literal

SpeciesType = Literal["Dog", "Cat", "Rabbit", "Bird", "Hamster", "Fish", "Other"]
ActivityLevelType = Literal["Low", "Moderate", "High"]
GenderType = Literal["Male", "Female"]


class PetCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    species: SpeciesType
    breed: Optional[str] = None
    age: Optional[float] = Field(default=None, ge=0)
    gender: Optional[GenderType] = None
    weight: Optional[float] = Field(default=None, ge=0)
    activity_level: Optional[ActivityLevelType] = "Moderate"
    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None
    food_preferences: Optional[str] = None


class PetUpdate(BaseModel):
    """All fields optional — only send what needs to change."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    species: Optional[SpeciesType] = None
    breed: Optional[str] = None
    age: Optional[float] = Field(default=None, ge=0)
    gender: Optional[GenderType] = None
    weight: Optional[float] = Field(default=None, ge=0)
    activity_level: Optional[ActivityLevelType] = None
    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None
    food_preferences: Optional[str] = None


class PetResponse(BaseModel):
    id: str
    name: str
    species: SpeciesType
    breed: Optional[str] = None
    age: Optional[float] = None
    gender: Optional[GenderType] = None
    weight: Optional[float] = None
    activity_level: Optional[ActivityLevelType] = None
    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None
    food_preferences: Optional[str] = None