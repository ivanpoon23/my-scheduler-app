import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager # For reliable startup/shutdown

from routes.assignments import router as assignments_router
from routes.user_token import router as token_router
from routes.auth import router as auth_router

load_dotenv()

# Assuming these functions are defined in your db.py:
# from db import get_mongo_client, close_db_connection 

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Connect to MongoDB
#     print("Application startup: Establishing DB connection...")
#     try:
#         app.state.db_client = get_mongo_client()
#         app.state.db = app.state.db_client.get_database("canvas_scheduler")
#     except Exception as e:
#         print(f"FATAL ERROR: Failed to connect to database: {e}")
#     yield
#     # Close connection on shutdown
#     print("Application shutdown: Closing DB connection...")
#     close_db_connection(app.state.db_client)

# app = FastAPI(lifespan=lifespan)
# --- End Placeholder ---

app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        # Allow the Vite development server origin
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers - Ensure NO DUPLICATES
app.include_router(assignments_router, prefix="/api/canvas")
app.include_router(token_router, prefix="/api/user")
app.include_router(auth_router, prefix="/api/auth")

@app.get("/")
def root():
    return {"message": "Canvas Scheduling Backend Running"}