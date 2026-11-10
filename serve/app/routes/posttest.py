from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from app.database import store_posttest

router = APIRouter(
    prefix="/posttest",
    tags=["Posttest"]
)


class PosttestSchema(BaseModel):
    uid: str
    answers: list[int] = Field(..., min_length=6, max_length=6)
    language: str


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def submit_posttest(payload: PosttestSchema):
    saved_doc = await store_posttest(
        uid=payload.uid,
        answers=payload.answers,
        language=payload.language,
    )

    return {
        "status": "success",
        "message": "Posttest recorded successfully",
        "data": saved_doc
    }
