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


async def store_consent(
    uid: str,
    accepted: bool,
    language: str,
    email: str,
    consent_date: str | None = None,
) -> dict:
    consent_doc = {
        "uid": uid,
        "accepted": accepted,
        "language": language,
        "email": email,
    }
    if consent_date:
        consent_doc["consent_date"] = consent_date

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
    affiliation: str,
    gen_ai_familiarity: int,
    native_country: str,
    language: str,
) -> dict:
    demographics_doc = {
        "uid": uid,
        "age": age,
        "gender": gender,
        "status": status,
        "majorOrProfession": major_or_profession,
        "affiliation": affiliation,
        "genAiFamiliarity": gen_ai_familiarity,
        "nativeCountry": native_country,
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

async def store_posttest(
    uid: str,
    answers: list[int],
    language: str,
) -> dict:
    posttest_doc = {
        "uid": uid,
        "posttest_answers": answers,
        "language": language,
    }

    # Upserts the SAME per-uid document as the pretest, so pre and post
    # results are joined by uid in a single record
    await mongo_db.testdb.update_one(
        {"uid": uid},
        {"$set": posttest_doc},
        upsert=True,
    )

    return posttest_doc

async def store_clt(
    uid: str,
    part: int,
    answers: list[int],
    language: str,
) -> dict:
    """Stores one CLT part (5 Likert answers) on the SAME per-uid document as
    the pretest/posttest. Storage keys: clt_answers_icl / _ecl / _gcl."""
    part_keys = {1: "clt_answers_icl", 2: "clt_answers_ecl", 3: "clt_answers_gcl"}
    key = part_keys[part]

    clt_doc = {
        "uid": uid,
        key: answers,
        "language": language,
    }

    # Upserts the SAME per-uid document as the pretest/posttest, so all
    # questionnaire results are joined by uid in a single record
    await mongo_db.testdb.update_one(
        {"uid": uid},
        {"$set": clt_doc},
        upsert=True,
    )

    return clt_doc

async def store_imi(
    uid: str,
    part: int,
    answers: list[int],
    language: str,
) -> dict:
    """Stores one IMI part (5 or 7 Likert answers) on the SAME per-uid document
    as the pretest/posttest. Storage keys: imi_answers_interest /
    imi_answers_competence / imi_answers_value."""
    part_keys = {
        1: "imi_answers_interest",
        2: "imi_answers_competence",
        3: "imi_answers_value",
    }
    key = part_keys[part]

    imi_doc = {
        "uid": uid,
        key: answers,
        "language": language,
    }

    # Upserts the SAME per-uid document as the pretest/posttest, so all
    # questionnaire results are joined by uid in a single record
    await mongo_db.testdb.update_one(
        {"uid": uid},
        {"$set": imi_doc},
        upsert=True,
    )

    return imi_doc

async def store_thank(
    uid: str,
    opinion: str,
    willing: bool,
    language: str,
) -> dict:
    """Stores the closing thank-you responses on the SAME per-uid document as
    all other study data. Keys: thank_opinion, thank_willing."""
    thank_doc = {
        "uid": uid,
        "thank_opinion": opinion,
        "thank_willing": willing,
        "language": language,
    }

    # Upserts the SAME per-uid document as everything else in testdb
    await mongo_db.testdb.update_one(
        {"uid": uid},
        {"$set": thank_doc},
        upsert=True,
    )

    return thank_doc


async def store_quest_progress(
    uid: str,
    section_id: int,
    event: str,
    language: str = "en",
    selected_option: int | str | None = None,
    clicks_count: int = 0,
    is_correct: bool | None = None,
    timestamp: int | None = None,
    quest_round: int | None = None,
) -> dict:
    """One document per (uid, round) in `quest_progress` — a participant who does
    both study rounds gets a separate document per round, so round data never
    overwrites each other. Each section is a subdocument `section_<id>` holding:
    answer, is_correct, attempts, clicks_count, continue_at (timestamp of the
    Continue press) and first_attempt.

    `first_attempt` is set from the grade of the FIRST submitted answer and is
    never overwritten afterwards. `quest_round` (1 or 2) is part of the document
    key and stored as `round`.
    """
    coll = mongo_db.quest_progress
    filt = {"uid": uid}
    if quest_round is not None:
        filt["round"] = quest_round

    doc = await coll.find_one(filt) or {"uid": uid}

    key = f"section_{section_id}"
    section = doc.get(key) or {"attempts": 0}

    if event == "feedback":
        first_submission = section.get("attempts", 0) == 0
        section["answer"] = selected_option
        section["is_correct"] = is_correct
        section["clicks_count"] = clicks_count
        section["continue_at"] = timestamp
        section["attempts"] = section.get("attempts", 0) + 1
        if first_submission:
            section["first_attempt"] = is_correct

    doc[key] = section

    update_set = {key: section, "language": language}
    if quest_round is not None:
        doc["round"] = quest_round
        update_set["round"] = quest_round

    await coll.update_one(
        filt,
        {"$set": update_set},
        upsert=True,
    )

    return section