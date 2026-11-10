from datetime import date

from fastapi import APIRouter, status
from pydantic import BaseModel

from app.database import store_consent

router = APIRouter(
    prefix="/consent",
    tags=["Consent"]
)


class ConsentSchema(BaseModel):
    uid: str
    email: str
    accepted: bool
    language: str


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def submit_consent(payload: ConsentSchema):
    saved_doc = await store_consent(
        uid=payload.uid,
        email=payload.email,
        accepted=payload.accepted,
        language=payload.language,
        consent_date=date.today().isoformat(),
    )

    return {
        "status": "success",
        "message": "Consent recorded successfully",
        "data": saved_doc,
    }