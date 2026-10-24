from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    pet_id: Optional[str] = None
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    conversation_id: str
    reply: str
    is_emergency: bool = False


class MessageResponse(BaseModel):
    role: Literal["user", "ai"]
    content: str
    is_emergency: bool = False
    timestamp: datetime


class ConversationResponse(BaseModel):
    id: str
    title: str
    pet_id: Optional[str] = None
    messages: List[MessageResponse] = []
    created_at: datetime
    updated_at: datetime


class ConversationRenameRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    