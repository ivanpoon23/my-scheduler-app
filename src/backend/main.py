import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.auth import router as auth_router
from routes.assignments import router as assignments_router

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Allow requests from your frontend (localhost:5173 for Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(auth_router, prefix="/api/auth")
app.include_router(assignments_router, prefix="/api/canvas")


@app.get("/")
def root():
    return {"message": "Canvas Scheduling Backend Running"}
