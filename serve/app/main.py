from contextlib import asynccontextmanager

from fastapi import FastAPI
from pathlib import Path

from app.database import connect_mongo, close_mongo
from app.redis import connect_redis, close_redis
from app.routes.consent import router as consent_router
from app.routes.quest import router as quest_router
from app.routes.img_cap import router as img_router
from app.routes.pretest import router as pretest_router
from app.routes.posttest import router as posttest_router
from app.routes.clt import router as clt_router
from app.routes.imi import router as imi_router
from app.routes.thank import router as thank_router
from app.routes.health import router as health_router
from app.routes.email import router as email_router
from app.routes.demographics import router as demo_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import Depends

from app.auth import verify_signature


@asynccontextmanager
async def lifespan(app: FastAPI):

    await connect_mongo()
    await connect_redis()

    yield

    await close_mongo()
    await close_redis()


app = FastAPI(
    title="LRN4CHG API",
    version="1.0.0",
    lifespan=lifespan,
    dependencies=[Depends(verify_signature)],  # every route requires a valid signature (M35)
)

BASE_DIR = Path(__file__).resolve().parent
IMAGE_DIR = BASE_DIR / "images"

app.mount(
    "/images",
    StaticFiles(directory=str(IMAGE_DIR)),
    name="images"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8100",  # Ionic serve dev server
        "http://localhost:4200",  # Angular dev server
        "https://app.lrn4chng.site"  # Production frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(email_router)
app.include_router(consent_router)
app.include_router(demo_router)
app.include_router(pretest_router)
app.include_router(posttest_router)
app.include_router(clt_router)
app.include_router(imi_router)
app.include_router(thank_router)
app.include_router(img_router)
app.include_router(quest_router)


@app.get("/")
async def root():
    return {
        "message": "FastAPI is running",
        "host": "api.lrn4chg.site",
    }