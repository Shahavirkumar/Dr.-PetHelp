from fastapi import APIRouter, HTTPException, Depends, status
from typing import List

from app.schemas.chat_schema import ChatRequest, ChatResponse, ConversationResponse, ConversationRenameRequest
from app.services import chat_service
from app.utils.jwt_handler import get_current_user

router = APIRouter(prefix="/api/chat", tags=["Chat"])
chats_router = APIRouter(prefix="/api/chats", tags=["Chat History"])


@router.post("", response_model=ChatResponse)
async def send_message(payload: ChatRequest, current_user: dict = Depends(get_current_user)):
    """
    Send a message to PetHelp AI.
    Creates a new conversation if conversation_id is not provided.
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty.")

    try:
        return await chat_service.handle_chat_message(current_user["id"], payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="PetHelp AI is temporarily unavailable. Please try again shortly.",
        )


@chats_router.get("", response_model=List[ConversationResponse])
async def get_conversations(current_user: dict = Depends(get_current_user)):
    """Get all conversations for the logged-in user (most recent first)."""
    return await chat_service.get_conversations_for_user(current_user["id"])


@chats_router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(conversation_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single conversation with its full message history."""
    conversation = await chat_service.get_conversation_by_id(conversation_id, current_user["id"])
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return conversation


@chats_router.put("/{conversation_id}", response_model=ConversationResponse)
async def rename_conversation(
    conversation_id: str,
    payload: ConversationRenameRequest,
    current_user: dict = Depends(get_current_user),
):
    """Rename a conversation."""
    updated = await chat_service.rename_conversation(conversation_id, current_user["id"], payload.title)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return updated


@chats_router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a conversation."""
    deleted = await chat_service.delete_conversation(conversation_id, current_user["id"])
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return {"message": "Conversation deleted successfully."}