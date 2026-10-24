from datetime import datetime, timezone
from bson import ObjectId

from app.database.db import db
from app.schemas.pet_schema import PetCreate, PetUpdate, PetResponse

pets_collection = db["pets"]


def _pet_to_response(pet: dict) -> PetResponse:
    return PetResponse(
        id=str(pet["_id"]),
        name=pet["name"],
        species=pet["species"],
        breed=pet.get("breed"),
        age=pet.get("age"),
        gender=pet.get("gender"),
        weight=pet.get("weight"),
        activity_level=pet.get("activity_level"),
        allergies=pet.get("allergies"),
        medical_conditions=pet.get("medical_conditions"),
        food_preferences=pet.get("food_preferences"),
    )


async def get_pets_for_user(user_id: str) -> list[PetResponse]:
    cursor = pets_collection.find({"owner_id": ObjectId(user_id)}).sort("created_at", -1)
    return [_pet_to_response(pet) async for pet in cursor]


async def get_pet_by_id(pet_id: str, user_id: str) -> PetResponse | None:
    if not ObjectId.is_valid(pet_id):
        return None
    pet = await pets_collection.find_one({"_id": ObjectId(pet_id), "owner_id": ObjectId(user_id)})
    return _pet_to_response(pet) if pet else None


async def create_pet(user_id: str, payload: PetCreate) -> PetResponse:
    now = datetime.now(timezone.utc)
    pet_doc = {
        **payload.model_dump(),
        "owner_id": ObjectId(user_id),
        "created_at": now,
        "updated_at": now,
    }
    result = await pets_collection.insert_one(pet_doc)
    pet_doc["_id"] = result.inserted_id
    return _pet_to_response(pet_doc)


async def update_pet(pet_id: str, user_id: str, payload: PetUpdate) -> PetResponse | None:
    if not ObjectId.is_valid(pet_id):
        return None

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        return await get_pet_by_id(pet_id, user_id)

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await pets_collection.find_one_and_update(
        {"_id": ObjectId(pet_id), "owner_id": ObjectId(user_id)},
        {"$set": update_data},
        return_document=True,
    )
    return _pet_to_response(result) if result else None


async def delete_pet(pet_id: str, user_id: str) -> bool:
    if not ObjectId.is_valid(pet_id):
        return False
    result = await pets_collection.delete_one({"_id": ObjectId(pet_id), "owner_id": ObjectId(user_id)})
    return result.deleted_count > 0