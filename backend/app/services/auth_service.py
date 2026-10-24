from datetime import datetime, timezone
from bson import ObjectId

from app.database.db import db
from app.schemas.auth_schema import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from app.utils.password_hash import hash_password, verify_password
from app.utils.jwt_handler import create_access_token

users_collection = db["users"]


def _user_to_response(user: dict) -> UserResponse:
    return UserResponse(id=str(user["_id"]), name=user["name"], email=user["email"])


async def register_user(payload: RegisterRequest) -> AuthResponse:
    existing = await users_collection.find_one({"email": payload.email.lower()})
    if existing:
        raise ValueError("An account with this email already exists.")

    now = datetime.now(timezone.utc)
    user_doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "created_at": now,
        "updated_at": now,
    }
    result = await users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = create_access_token({"sub": str(user_doc["_id"])})
    return AuthResponse(token=token, user=_user_to_response(user_doc))


async def login_user(payload: LoginRequest) -> AuthResponse:
    user = await users_collection.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise ValueError("Invalid email or password.")

    token = create_access_token({"sub": str(user["_id"])})
    return AuthResponse(token=token, user=_user_to_response(user))


async def get_user_by_id(user_id: str) -> UserResponse | None:
    if not ObjectId.is_valid(user_id):
        return None
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None
    return _user_to_response(user)