import os
from dotenv import load_dotenv
import motor.motor_asyncio

load_dotenv()

# ---------------------------------------------------------------------------
# MongoDB connection setup
# ---------------------------------------------------------------------------
# Uses Motor (the async MongoDB driver) so it works cleanly with FastAPI's
# async routes and our async service functions (find_one, insert_one, etc.).

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "pethelp_ai")

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI environment variable is not set. "
        "Please add it to your .env file (see .env.example)."
    )

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]


async def check_database_connection() -> bool:
    """
    Pings MongoDB to confirm the connection is alive.
    Called once at app startup (see main.py) so connection issues
    are caught immediately instead of failing silently on first request.
    """
    try:
        await client.admin.command("ping")
        return True
    except Exception as e:
        raise RuntimeError(f"Could not connect to MongoDB: {e}")


async def create_indexes():
    """
    Creates indexes used across the app for correctness and performance.
    Safe to call every startup — MongoDB simply no-ops if an index already exists.
    """
    await db["users"].create_index("email", unique=True)
    await db["pets"].create_index("owner_id")
    await db["conversations"].create_index("user_id")
    await db["conversations"].create_index("updated_at")
    await db["recommendations"].create_index("user_id")