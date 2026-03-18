from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import logging

from app.api.v1.api import api_router
from app.core.conf import settings
from app.db.init_db import init_db
from app.services.ml_service import load_ml_model

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifelong_learning(app: FastAPI):
    logger.info("Starting up...")
    await init_db()
    load_ml_model()
    yield
    logger.info("Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME, 
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifelong_learning
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    print(f"DEBUG_RAW_REQUEST: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        duration = time.time() - start_time
        print(f"DEBUG_RAW_RESPONSE: {request.method} {request.url.path} - Status: {response.status_code} - Done in {duration:.4f}s")
        return response
    except Exception as e:
        print(f"DEBUG_RAW_ERROR: {request.method} {request.url.path} - Error: {str(e)}")
        raise e

# CORS configuration
origins = ["*"]
if settings.BACKEND_CORS_ORIGINS:
    origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to Fake Job Detection API"}

