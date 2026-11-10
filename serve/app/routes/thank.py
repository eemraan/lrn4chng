from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from app.database import store_thank

router = APIRouter(
    prefix="/thank",
    tags=["Thank You / Closing"]
)


class ThankSchema(BaseModel):
    uid: str
    # Open-text overall opinion — optional, may be empty
    opinion: str = Field(default="", max_length=5000)
    # Willing to contribute further — required yes/no
    willing: bool
    language: str


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def submit_thank(payload: ThankSchema):
    saved_doc = await store_thank(
        uid=payload.uid,
        opinion=payload.opinion,
        willing=payload.willing,
        language=payload.language,
    )

    return {
        "status": "success",
        "message": "Closing responses recorded successfully",
        "data": saved_doc
    }
