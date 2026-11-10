from typing import Annotated

from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from app.database import store_clt

router = APIRouter(
    prefix="/clt",
    tags=["Cognitive Load"]
)

# One Likert answer: integer 1–5
LikertScore = Annotated[int, Field(ge=1, le=5)]

# Which storage key each part writes to on the per-uid document
PART_KEYS = {
    1: "clt_answers_icl",   # Intrinsic Cognitive Load (items 1–5)
    2: "clt_answers_ecl",   # Extraneous Cognitive Load (items 6–10)
    3: "clt_answers_gcl",   # Germane Cognitive Load (items 11–15)
}


class CltSchema(BaseModel):
    uid: str
    # Questionnaire part: 1 = ICL, 2 = ECL, 3 = GCL — 5 items each
    part: int = Field(..., ge=1, le=3)
    answers: list[LikertScore] = Field(..., min_length=5, max_length=5)
    language: str


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def submit_clt(payload: CltSchema):
    saved_doc = await store_clt(
        uid=payload.uid,
        part=payload.part,
        answers=payload.answers,
        language=payload.language,
    )

    return {
        "status": "success",
        "message": "Cognitive load part recorded successfully",
        "data": saved_doc
    }
