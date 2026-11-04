# app/routers/quest.py  (adjust path to match your project structure)
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/quest",
    tags=["Quest"]
)


class QuestSectionTag(BaseModel):
    icon: str
    label: str
    cssClass: str | None = None


class QuestSectionOption(BaseModel):
    text: str
    isCorrect: bool


class QuestSectionFeedback(BaseModel):
    correct: dict
    incorrect: dict


class QuestSectionSchema(BaseModel):
    id: int
    type: str
    tag: QuestSectionTag
    question: str
    subtitle: str | None = None
    options: list[QuestSectionOption] | None = None
    binaryActions: list[dict] | None = None
    feedback: QuestSectionFeedback | None = None
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

class QuestResponse(BaseModel):
    status: str
    message: str | None = None
    data: QuestData | None = None


QUEST_DATA: QuestData = QuestData(
    questTitle="Ecology Quest",
    totalSteps=7,
    sections=[
        QuestSectionSchema(
            id=1,
            type="binary",
            tag=QuestSectionTag(icon="eye-outline", label="Observation", cssClass="obs"),
            question="Do you see the trees in front of you?",
            subtitle="Take a moment to inspect the surrounding foliage before answering.",
            binaryActions=[
                {"value": "yes", "icon": "🌲", "text": "Yes, I see them"},
                {"value": "no", "icon": "🔍", "text": "No, let me look closer"},
            ],
            continueText="Continue to Question 2",
        ),
        QuestSectionSchema(
            id=2,
            type="single-select",
            tag=QuestSectionTag(icon="thermometer-outline", label="Conditions (14°C)", cssClass="alt"),
            question="In these cold conditions of 14°C and low humidity, what is happening to the trees?",
            options=[
                QuestSectionOption(text="Leaves break down chlorophyll and change color to conserve nutrients and prepare for winter dormancy.", isCorrect=True),
                QuestSectionOption(text="Leaves produce excess chlorophyll to absorb cold sunlight and accelerate growth.", isCorrect=False),
                QuestSectionOption(text="Trees absorb groundwater rapidly to pump warm sap and sprout new foliage.", isCorrect=False),
            ],
            feedback=QuestSectionFeedback(
                correct={"header": "Great Insight!", "message": "Lower temperatures trigger trees to break down chlorophyll for dormancy."},
                incorrect={"header": "Try Again!", "message": "Re-read the options to find how cold weather affects leaf chlorophyll."},
            ),
            continueText="Continue to Question 3",
        ),
        QuestSectionSchema(
            id=3,
            type="single-select",
            tag=QuestSectionTag(icon="flash-outline", label="Plant Biology", cssClass="energy"),
            question="How do you think plants create energy?",
            letterBadges=True,
            options=[
                QuestSectionOption(text="Photosynthesis — converting light energy into chemical energy", isCorrect=True),
                QuestSectionOption(text="Soil Absorption — drawing energy directly from ground heat and minerals", isCorrect=False),
            ],
            feedback=QuestSectionFeedback(
                correct={"header": "Spot On!", "message": "Plants use solar energy through photosynthesis to produce fuel."},
                incorrect={"header": "Try Again!", "message": "Plants rely on light rather than soil heat for energy synthesis."},
            ),
            continueText="Continue to Question 4",
        ),
        QuestSectionSchema(
            id=4,
            type="single-select",
            tag=QuestSectionTag(icon="flask-outline", label="Chemical Reaction", cssClass="chemical"),
            question="What exactly happens in photosynthesis?",
            options=[
                QuestSectionOption(text="Plants take in carbon dioxide and water, using light energy to produce glucose (sugar) and release oxygen as a byproduct.", isCorrect=True),
                QuestSectionOption(text="Plants absorb oxygen and glucose from the air, using soil heat to generate light energy and release water vapor.", isCorrect=False),
                QuestSectionOption(text="Plants draw nitrogen and minerals from the soil, using underground warmth to synthesize chlorophyll and release carbon dioxide.", isCorrect=False),
            ],
            feedback=QuestSectionFeedback(
                correct={"header": "Correct!", "message": "CO₂ + Light + Water yields Glucose and Oxygen."},
                incorrect={"header": "Try Again!", "message": "Think about which inputs produce glucose and oxygen."},
            ),
            continueText="Continue to Question 5",
        ),
        QuestSectionSchema(
            id=5,
            type="textarea",
            tag=QuestSectionTag(icon="cloud-outline", label="Carbon Cycle", cssClass="climate"),
            question="When trees go dormant, how does it affect CO₂ emission?",
            subtitle="Explain your reasoning in the box below (at least 10 words).",
            placeholder="Type your explanation here...",
            minWords=10,
            choicePromptText="Do you want to know what happens next or finish?",
        ),
        QuestSectionSchema(
            id=6,
            type="single-select",
            tag=QuestSectionTag(icon="leaf-outline", label="Atmospheric Oxygen", cssClass="oxygen"),
            question="What happens to Oxygen (O₂) output when trees are dormant in winter?",
            options=[
                QuestSectionOption(text="Oxygen production drops significantly because dormant trees stop photosynthesizing.", isCorrect=True),
                QuestSectionOption(text="Oxygen levels double as cold air compresses gas molecules around the tree canopy.", isCorrect=False),
                QuestSectionOption(text="Oxygen stays completely unchanged because leaves store extra oxygen reserves.", isCorrect=False),
            ],
            feedback=QuestSectionFeedback(
                correct={"header": "Exactly Right!", "message": "Without leaves photosynthesizing, net oxygen release from deciduous forests decreases during winter months."},
                incorrect={"header": "Try Again!", "message": "Consider how photosynthesis generates O₂ and what happens when it shuts down."},
            ),
            choicePromptText="Do you want to know what happens next or finish?",
        ),
        QuestSectionSchema(
            id=7,
            type="binary",
            tag=QuestSectionTag(icon="earth-outline", label="Take Action", cssClass="final"),
            question="Do you think it is important to do our part to reduce CO₂ emissions in winter?",
            binaryActions=[
                {"value": "yes", "icon": "🌍", "text": "Yes, absolutely"},
                {"value": "no", "icon": "🤔", "text": "No, not necessary"},
            ],
            choicePromptText="Do you want to know what happens next or finish?",
            finishText="Finish & Complete Quest",
        ),
    ],
)


@router.get("", response_model=QuestData)
@router.get("/", response_model=QuestData, include_in_schema=False)
async def get_quest():
    return QUEST_DATA

@router.get("", response_model=QuestResponse)
@router.get("/", response_model=QuestResponse, include_in_schema=False)
async def get_quest():
    return QuestResponse(
        status="success",
        message="Quest loaded successfully",
        data=QUEST_DATA,
    )