from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional, Literal, List

from app.models.py_object_id import PyObjectId


class MessageModel(BaseModel):
    """A single message inside a conversation's messages array."""

    role: Literal["user", "ai"]
    content: str
    is_emergency: bool = False
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ConversationModel(BaseModel):
    """
    Represents a conversation document as stored in MongoDB (collection: 'conversations').
    Messages are embedded directly since a single conversation's history is always
    fetched and displayed together (no need for a separate collection/joins).
    """

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: PyObjectId
    pet_id: Optional[PyObjectId] = None
    title: str = "New Conversation"
    messages: List[MessageModel] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }