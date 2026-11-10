from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from app.database import store_demographics

router = APIRouter(
    prefix="/demographics",
    tags=["Demographics"]
)


class DemographicsSchema(BaseModel):
    uid: str
    age: int = Field(..., ge=10, le=100)
    gender: str
    status: str
    majorOrProfession: str = Field(..., min_length=2)
    affiliation: str = Field(..., min_length=2)
    genAiFamiliarity: int = Field(..., ge=1, le=5)
    nativeCountry: str
    language: str


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def submit_demographics(payload: DemographicsSchema):
    saved_doc = await store_demographics(
        uid=payload.uid,
        age=payload.age,
        gender=payload.gender,
        status=payload.status,
        major_or_profession=payload.majorOrProfession,
        affiliation=payload.affiliation,
        gen_ai_familiarity=payload.genAiFamiliarity,
        native_country=payload.nativeCountry,
        language=payload.language,
    )

    return {
        "status": "success",
        "message": "Demographics recorded successfully",
        "data": saved_doc,
    }