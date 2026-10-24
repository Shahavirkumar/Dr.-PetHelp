from datetime import datetime, timezone
from bson import ObjectId

from app.database.db import db
from app.schemas.recommendation_schema import RecommendationCreate, RecommendationResponse

recommendations_collection = db["recommendations"]


def _recommendation_to_response(rec: dict) -> RecommendationResponse:
    return RecommendationResponse(
        id=str(rec["_id"]),
        title=rec["title"],
        content=rec["content"],
        category=rec["category"],
        pet_id=str(rec["pet_id"]) if rec.get("pet_id") else None,
        created_at=rec["created_at"],
    )


async def get_recommendations_for_user(user_id: str) -> list[RecommendationResponse]:
    cursor = recommendations_collection.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
    return [_recommendation_to_response(r) async for r in cursor]


async def create_recommendation(user_id: str, payload: RecommendationCreate) -> RecommendationResponse:
    rec_doc = {
        "user_id": ObjectId(user_id),
        "pet_id": ObjectId(payload.pet_id) if payload.pet_id and ObjectId.is_valid(payload.pet_id) else None,
        "title": payload.title,
        "content": payload.content,
        "category": payload.category,
        "created_at": datetime.now(timezone.utc),
    }
    result = await recommendations_collection.insert_one(rec_doc)
    rec_doc["_id"] = result.inserted_id
    return _recommendation_to_response(rec_doc)


async def delete_recommendation(recommendation_id: str, user_id: str) -> bool:
    if not ObjectId.is_valid(recommendation_id):
        return False
    result = await recommendations_collection.delete_one(
        {"_id": ObjectId(recommendation_id), "user_id": ObjectId(user_id)}
    )
    return result.deleted_count > 0