from fastapi import APIRouter, HTTPException, Depends, status

from app.schemas.auth_schema import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from app.services import auth_service
from app.utils.jwt_handler import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    """Create a new user account and return a JWT token."""
    try:
        return await auth_service.register_user(payload)
    except ValueError as e:
        # e.g. email already registered
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create account. Please try again.",
        )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    """Authenticate a user and return a JWT token."""
    try:
        return await auth_service.login_user(payload)
    except ValueError as e:
        # invalid credentials
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again.",
        )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return the currently logged-in user's profile."""
    return current_user