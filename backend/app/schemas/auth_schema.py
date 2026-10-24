from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User data returned to the frontend — never includes password_hash."""
    id: str
    name: str
    email: EmailStr


class AuthResponse(BaseModel):
    """Returned after successful register/login."""
    token: str
    user: UserResponse