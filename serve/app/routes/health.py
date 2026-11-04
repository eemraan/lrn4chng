
from app.redis import redis_client

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_mongo_db

router = APIRouter()


@router.get("/health/mongo")
async def health_mongo(
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    try:
        await db.command("ping")

        return {
            "status": "ok",
            "service": "mongodb",
        }

    except Exception as e:
        return {
            "status": "error",
            "service": "mongodb",
            "error": str(e),
        }


@router.get("/health/redis")
async def health_redis():
    try:
        await redis_client.ping()

        return {
            "status": "ok",
            "service": "redis",
        }

    except Exception as e:
        return {
            "status": "error",
            "service": "redis",
            "error": str(e),
        }