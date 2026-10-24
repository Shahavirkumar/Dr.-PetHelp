from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os

from app.database.db import check_database_connection, create_indexes
from app.routes import auth, pets, recommendations
from app.routes.chat import router as chat_router, chats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs once when the server starts and once when it shuts down."""
    await check_database_connection()
    await create_indexes()
    print("✅ PetHelp AI backend started. MongoDB connected and indexes ready.")
    yield
    print("👋 PetHelp AI backend shutting down.")


app = FastAPI(
    title="PetHelp AI API",
    description="Backend API for PetHelp AI — an AI-powered pet care assistant.",
    version="1.0.0",
    lifespan=lifespan,
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong on our end. Please try again."},
    )


app.include_router(auth.router)
app.include_router(pets.router)
app.include_router(chat_router)
app.include_router(chats_router)
app.include_router(recommendations.router)


@app.get("/")
async def root():
    return {"message": "PetHelp AI API is running 🐾"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}