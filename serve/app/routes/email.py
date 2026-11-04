from fastapi import APIRouter
from pydantic import BaseModel

from app.database import store_email_hash

router = APIRouter()


class EmailRequest(BaseModel):
    email: str


@router.post("/email")
async def test_email(request: EmailRequest):
    email_hash = await store_email_hash(request.email)

    return {
        "email": request.email,
        "hash": email_hash,
    }