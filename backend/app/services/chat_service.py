from datetime import datetime, timezone
from bson import ObjectId

from app.database.db import db
from app.schemas.chat_schema import ChatRequest, ChatResponse, ConversationResponse
from app.services import ai_service, pet_service

conversations_collection = db["conversations"]
pets_collection = db["pets"]


def _conversation_to_response(convo: dict) -> ConversationResponse:
    return ConversationResponse(
        id=str(convo["_id"]),
        title=convo.get("title", "New Conversation"),
        pet_id=str(convo["pet_id"]) if convo.get("pet_id") else None,
        messages=convo.get("messages", []),
        created_at=convo["created_at"],
        updated_at=convo["updated_at"],
    )


def _make_title_from_message(message: str) -> str:
    """Generates a short conversation title from the first user message."""
    trimmed = message.strip()
    return (trimmed[:47] + "...") if len(trimmed) > 50 else trimmed


async def handle_chat_message(user_id: str, payload: ChatRequest) -> ChatResponse:
    now = datetime.now(timezone.utc)

    # Load or create the conversation
    if payload.conversation_id and ObjectId.is_valid(payload.conversation_id):
        conversation = await conversations_collection.find_one(
            {"_id": ObjectId(payload.conversation_id), "user_id": ObjectId(user_id)}
        )
    else:
        conversation = None

    if not conversation:
        conversation = {
            "user_id": ObjectId(user_id),
            "pet_id": ObjectId(payload.pet_id) if payload.pet_id and ObjectId.is_valid(payload.pet_id) else None,
            "title": _make_title_from_message(payload.message),
            "messages": [],
            "created_at": now,
            "updated_at": now,
        }
        result = await conversations_collection.insert_one(conversation)
        conversation["_id"] = result.inserted_id

    # Load pet profile (if linked) to personalize the AI's response
    pet = None
    if conversation.get("pet_id"):
        pet = await pets_collection.find_one({"_id": conversation["pet_id"]})

    # Get AI response, using existing history for context
    is_emergency = ai_service.detect_emergency(payload.message)
    reply_text = await ai_service.generate_ai_response(
        user_message=payload.message,
        pet=pet,
        history=conversation.get("messages", []),
    )

    user_msg = {"role": "user", "content": payload.message, "is_emergency": is_emergency, "timestamp": now}
    ai_msg = {"role": "ai", "content": reply_text, "is_emergency": is_emergency, "timestamp": datetime.now(timezone.utc)}

    await conversations_collection.update_one(
        {"_id": conversation["_id"]},
        {
            "$push": {"messages": {"$each": [user_msg, ai_msg]}},
            "$set": {"updated_at": datetime.now(timezone.utc)},
        },
    )

    return ChatResponse(
        conversation_id=str(conversation["_id"]),
        reply=reply_text,
        is_emergency=is_emergency,
    )


async def get_conversations_for_user(user_id: str) -> list[ConversationResponse]:
    cursor = conversations_collection.find({"user_id": ObjectId(user_id)}).sort("updated_at", -1)
    return [_conversation_to_response(c) async for c in cursor]


async def get_conversation_by_id(conversation_id: str, user_id: str) -> ConversationResponse | None:
    if not ObjectId.is_valid(conversation_id):
        return None
    convo = await conversations_collection.find_one(
        {"_id": ObjectId(conversation_id), "user_id": ObjectId(user_id)}
    )
    return _conversation_to_response(convo) if convo else None


async def rename_conversation(conversation_id: str, user_id: str, title: str) -> ConversationResponse | None:
    if not ObjectId.is_valid(conversation_id):
        return None
    result = await conversations_collection.find_one_and_update(
        {"_id": ObjectId(conversation_id), "user_id": ObjectId(user_id)},
        {"$set": {"title": title, "updated_at": datetime.now(timezone.utc)}},
        return_document=True,
    )
    return _conversation_to_response(result) if result else None


async def delete_conversation(conversation_id: str, user_id: str) -> bool:
    if not ObjectId.is_valid(conversation_id):
        return False
    result = await conversations_collection.delete_one(
        {"_id": ObjectId(conversation_id), "user_id": ObjectId(user_id)}
    )
    return result.deleted_count > 0