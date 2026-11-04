import os

from redis.asyncio import Redis

REDIS_URL = os.getenv(
    "REDIS_URL",
    "redis://localhost:6379/0",
)

redis_client: Redis | None = None


async def connect_redis():
    global redis_client

    redis_client = Redis.from_url(
        REDIS_URL,
        decode_responses=True,
    )

    await redis_client.ping()

    print("Redis connected")


async def close_redis():
    global redis_client

    if redis_client:
        await redis_client.aclose()