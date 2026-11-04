import hashlib
import os

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://localhost:27017/lrn4chg",
)

mongo_client: AsyncIOMotorClient | None = None
mongo_db = None


async def connect_mongo():
    global mongo_client
    global mongo_db

    mongo_client = AsyncIOMotorClient(MONGO_URL)
    mongo_db = mongo_client["test"]

    await mongo_client.admin.command("ping")

    print("MongoDB connected")


async def close_mongo():
    global mongo_client

    if mongo_client:
        mongo_client.close()


async def get_mongo_db():
    return mongo_db


async def store_email_hash(email: str) -> str:
    normalized_email = email.strip().lower()

    email_hash = hashlib.sha256(
        normalized_email.encode("utf-8")
    ).hexdigest()

    db = mongo_client["test_emails"]

    await db.emails.update_one(
        {"email": normalized_email},
        {
            "$set": {
                "hash": email_hash,
            }
        },
        upsert=True,
    )

    return email_hash


async def store_consent(uid: str, accepted: bool, language: str, email: str) -> dict:
    consent_doc = {
        "uid": uid,
        "accepted": accepted,
        "language": language,
        "email": email,
    }

    # Upserts document by uid so duplicate submissions update the existing record
    await mongo_db.testdb.update_one(
        {"uid": uid},
        {"$set": consent_doc},
        upsert=True,
    )

    return consent_doc


async def store_demographics(
    uid: str,
    age: int,
    gender: str,
    status: str,
    major_or_profession: str,
    gen_ai_familiarity: int,
    native_country: str,
    is_le_mans_student: bool,
    language: str,
) -> dict:
    demographics_doc = {
        "uid": uid,
        "age": age,
        "gender": gender,
        "status": status,
        "majorOrProfession": major_or_profession,
        "genAiFamiliarity": gen_ai_familiarity,
        "nativeCountry": native_country,
        "is_le_mans_student": is_le_mans_student,
        "language": language,
    }

    # Upserts document by uid into the demographics collection
    await mongo_db.testdb.update_one(
        {"uid": uid},
        {"$set": demographics_doc},
        upsert=True,
    )

    return demographics_doc

async def store_pretest(
    uid: str,
    answers: list[int],
    language: str,
) -> dict:
    pretest_doc = {
        "uid": uid,
        "pretest_answers": answers,
        "language": language,
    }

    # Upserts document by uid so duplicate submissions update the existing record
    await mongo_db.testdb.update_one(
        {"uid": uid},
        {"$set": pretest_doc},
        upsert=True,
    )

    return pretest_doc