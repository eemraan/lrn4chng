from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from app.database import store_pretest

router = APIRouter(
    prefix="/pretest",
    tags=["Pretest"]
)


class PretestSchema(BaseModel):
    uid: str
    answers: list[int] = Field(..., min_length=6, max_length=6)
    language: str


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def submit_pretest(payload: PretestSchema):
    saved_doc = await store_pretest(
        uid=payload.uid,
        answers=payload.answers,
        language=payload.language,
    )
    image_url = "https://api.lrn4chng.site/images/img_exst/test.jpg"

    return {
        "status": "success",
        "message": "Pretest recorded successfully",
        "data": saved_doc,
        "image_url": image_url
    }