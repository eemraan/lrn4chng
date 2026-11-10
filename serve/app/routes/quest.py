# app/routers/quest.py
import hashlib
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.database import store_quest_progress

router = APIRouter(
    prefix="/quest",
    tags=["Quest"]
)


# ============================================================
# Internal models (server-side only — never exposed to clients)
# ============================================================

class QuestSectionTag(BaseModel):
    icon: str
    label: str
    cssClass: str | None = None


class QuestSectionOption(BaseModel):
    text: str
    isCorrect: bool
    # Shown to the participant when THIS option is picked (server-side only —
    # never included in the public section payload)
    feedback: dict  # {"header": str, "message": str}


class QuestSectionSchema(BaseModel):
    id: int
    type: str
    tag: QuestSectionTag
    question: str
    subtitle: str | None = None
    options: list[QuestSectionOption] | None = None
    binaryActions: list[dict] | None = None
    placeholder: str | None = None
    minWords: int | None = None
    continueText: str | None = None
    choicePromptText: str | None = None
    finishText: str | None = None
    letterBadges: bool | None = None


class QuestData(BaseModel):
    questTitle: str
    totalSteps: int
    sections: list[QuestSectionSchema]


# ============================================================
# Public models (sent to clients — no answers, no feedback text)
# ============================================================

class PublicQuestSectionOption(BaseModel):
    text: str


class PublicQuestSection(BaseModel):
    id: int
    type: str
    tag: QuestSectionTag
    question: str
    subtitle: str | None = None
    options: list[PublicQuestSectionOption] | None = None
    binaryActions: list[dict] | None = None
    placeholder: str | None = None
    minWords: int | None = None
    continueText: str | None = None
    choicePromptText: str | None = None
    finishText: str | None = None
    letterBadges: bool | None = None


class PublicQuestData(BaseModel):
    questTitle: str
    totalSteps: int
    sections: list[PublicQuestSection]


class QuestResponse(BaseModel):
    status: str
    message: str | None = None
    data: PublicQuestData | None = None


class SectionFetchResponse(BaseModel):
    status: str
    questTitle: str
    totalSteps: int
    section: PublicQuestSection


class FeedbackPayload(BaseModel):
    uid: str
    sectionId: int
    timestamp: int
    clicksCount: int = 0
    selectedOption: int | str | None = None
    textInput: str | None = None
    allResponses: dict | None = None
    language: str = "en"
    round: int | None = None  # 1 or 2; falls back to a uid-derived round


class FeedbackResponse(BaseModel):
    status: str
    isCorrect: bool
    header: str
    message: str


# ============================================================
# Quest content (single source of truth)
# ============================================================

# Quest content lives in JSON files (one per study round), loaded at startup.
# Files: app/data/quest_round1.json, quest_round2.json — same schema, different
# content. Internal-only fields (isCorrect, feedback) stay on the server.
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
ROUNDS = (1, 2)


def _load_quests() -> dict[int, "QuestData"]:
    quests: dict[int, QuestData] = {}
    for n in ROUNDS:
        path = DATA_DIR / f"quest_round{n}.json"
        with open(path, encoding="utf-8") as f:
            quests[n] = QuestData.model_validate(json.load(f))
    return quests


QUESTS: dict[int, QuestData] = _load_quests()


def _resolve_round(uid: str, requested: int | None) -> int:
    """Explicit ?round= wins; otherwise a deterministic round derived from the
    uid (stable across calls, counterbalanced). The chosen round is logged on
    the uid's quest_progress document."""
    if requested in ROUNDS:
        return requested
    if uid:
        return int(hashlib.sha256(uid.encode("utf-8")).hexdigest(), 16) % len(ROUNDS) + 1
    return 1


# ============================================================
# Helpers
# ============================================================

def _find_section(round_no: int, section_id: int) -> QuestSectionSchema | None:
    quest = QUESTS.get(round_no) or QUESTS[1]
    for section in quest.sections:
        if section.id == section_id:
            return section
    return None


def _to_public(section: QuestSectionSchema) -> PublicQuestSection:
    """Strip correct-answer flags and feedback text before sending to a client."""
    return PublicQuestSection(
        id=section.id,
        type=section.type,
        tag=section.tag,
        question=section.question,
        subtitle=section.subtitle,
        options=(
            [PublicQuestSectionOption(text=o.text) for o in section.options]
            if section.options
            else None
        ),
        binaryActions=section.binaryActions,
        placeholder=section.placeholder,
        minWords=section.minWords,
        continueText=section.continueText,
        choicePromptText=section.choicePromptText,
        finishText=section.finishText,
        letterBadges=section.letterBadges,
    )


# ============================================================
# Endpoints
# ============================================================

@router.get("", response_model=QuestResponse)
@router.get("/", response_model=QuestResponse, include_in_schema=False)
async def get_quest(round: int = Query(1, ge=1, le=2)):
    """Legacy bulk endpoint — sanitized (no isCorrect / feedback leaked)."""
    quest = QUESTS[round]
    return QuestResponse(
        status="success",
        message="Quest loaded successfully",
        data=PublicQuestData(
            questTitle=quest.questTitle,
            totalSteps=quest.totalSteps,
            sections=[_to_public(s) for s in quest.sections],
        ),
    )


@router.get("/section", response_model=SectionFetchResponse)
async def get_quest_section(
    sectionId: int,
    uid: str = "",
    language: str = "en",
    round: int | None = Query(None, ge=1, le=2, alias="round"),
):
    round_no = _resolve_round(uid, round)
    quest = QUESTS[round_no]
    section = _find_section(round_no, sectionId)
    if section is None:
        raise HTTPException(status_code=404, detail=f"Quest section {sectionId} not found in round {round_no}")

    if uid:
        await store_quest_progress(
            uid=uid,
            section_id=sectionId,
            event="section_viewed",
            language=language,
            quest_round=round_no,
        )
    return SectionFetchResponse(
        status="success",
        questTitle=quest.questTitle,
        totalSteps=quest.totalSteps,
        section=_to_public(section),
    )


@router.post("/feedback", response_model=FeedbackResponse)
async def quest_feedback(payload: FeedbackPayload):
    round_no = _resolve_round(payload.uid, payload.round)
    section = _find_section(round_no, payload.sectionId)
    if section is None:
        raise HTTPException(status_code=404, detail=f"Quest section {payload.sectionId} not found in round {round_no}")

    is_correct = True
    header = "Response Recorded"
    message = "Your response has been recorded."

    # Grade single-select answers server-side and return the feedback of the
    # SPECIFIC option the user picked; binary/textarea get a neutral ack
    if (
        section.type == "single-select"
        and section.options
        and isinstance(payload.selectedOption, int)
    ):
        idx = payload.selectedOption
        if 0 <= idx < len(section.options):
            chosen = section.options[idx]
            is_correct = chosen.isCorrect
            fb = chosen.feedback or {}
            header = fb.get("header", header)
            message = fb.get("message", message)

    await store_quest_progress(
        uid=payload.uid,
        section_id=payload.sectionId,
        event="feedback",
        language=payload.language,
        selected_option=payload.selectedOption,
        clicks_count=payload.clicksCount,
        is_correct=is_correct,
        timestamp=payload.timestamp,
        quest_round=round_no,
    )

    return FeedbackResponse(
        status="success",
        isCorrect=is_correct,
        header=header,
        message=message,
    )
