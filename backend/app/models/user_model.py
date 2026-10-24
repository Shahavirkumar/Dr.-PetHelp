from datetime import datetime, timezone
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

from app.models.py_object_id import PyObjectId


class UserModel(BaseModel):
    """
    Represents a user document as stored in MongoDB (collection: 'users').
    password_hash is NEVER returned in API responses — only used internally.
    """

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }