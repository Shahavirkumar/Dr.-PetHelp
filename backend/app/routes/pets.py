from fastapi import APIRouter, HTTPException, Depends, status
from typing import List

from app.schemas.pet_schema import PetCreate, PetUpdate, PetResponse
from app.services import pet_service
from app.utils.jwt_handler import get_current_user

router = APIRouter(prefix="/api/pets", tags=["Pets"])


@router.get("", response_model=List[PetResponse])
async def get_pets(current_user: dict = Depends(get_current_user)):
    """Get all pets belonging to the logged-in user."""
    return await pet_service.get_pets_for_user(current_user["id"])


@router.post("", response_model=PetResponse, status_code=status.HTTP_201_CREATED)
async def create_pet(payload: PetCreate, current_user: dict = Depends(get_current_user)):
    """Create a new pet profile for the logged-in user."""
    try:
        return await pet_service.create_pet(current_user["id"], payload)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{pet_id}", response_model=PetResponse)
async def get_pet(pet_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single pet by ID (must belong to the logged-in user)."""
    pet = await pet_service.get_pet_by_id(pet_id, current_user["id"])
    if not pet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found.")
    return pet


@router.put("/{pet_id}", response_model=PetResponse)
async def update_pet(pet_id: str, payload: PetUpdate, current_user: dict = Depends(get_current_user)):
    """Update an existing pet profile."""
    updated = await pet_service.update_pet(pet_id, current_user["id"], payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found.")
    return updated


@router.delete("/{pet_id}", status_code=status.HTTP_200_OK)
async def delete_pet(pet_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a pet profile."""
    deleted = await pet_service.delete_pet(pet_id, current_user["id"])
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found.")
    return {"message": "Pet deleted successfully."}