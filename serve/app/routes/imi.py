from typing import Annotated

from fastapi import APIRouter, status
from pydantic import BaseModel, Field, model_validator

from app.database import store_imi

router = APIRouter(
    prefix="/imi",
    tags=["Motivation"]
)

# One Likert answer: integer 1–5
LikertScore = Annotated[int, Field(ge=1, le=5)]

# Which storage key each part writes to on the per-uid document
PART_KEYS = {
    1: "imi_answers_interest",     # Interest / Enjoyment (5 items)
    2: "imi_answers_competence",   # Perceived Competence (5 items)
    3: "imi_answers_value",        # Perceived Value / Usefulness (7 items)
}

# Exact item count per part
PART_LENGTHS = {1: 5, 2: 5, 3: 7}


class ImiSchema(BaseModel):
    uid: str
    # Questionnaire part: 1 = Interest/Enjoyment, 2 = Competence, 3 = Value
    part: int = Field(..., ge=1, le=3)
    answers: list[LikertScore] = Field(..., min_length=5, max_length=7)
    language: str

    @model_validator(mode="after")
    def check_part_length(self):
        expected = PART_LENGTHS[self.part]
        if len(self.answers) != expected:
            raise ValueError(
                f"part {self.part} requires exactly {expected} answers, got {len(self.answers)}"
            )
        return self


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def submit_imi(payload: ImiSchema):
    saved_doc = await store_imi(
        uid=payload.uid,
        part=payload.part,
        answers=payload.answers,
        language=payload.language,
    )

    return {
        "status": "success",
        "message": "Motivation questionnaire part recorded successfully",
        "data": saved_doc
    }
