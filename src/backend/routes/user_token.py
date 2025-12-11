from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db import db   # access MongoDB
# NOTE: Add your encryption library imports here, e.g., from your_utils import encrypt_token, decrypt_token

router = APIRouter()

class TokenPayload(BaseModel):
    token: str

def get_user_id():
    return "demo-user" 

@router.post("/canvas/token")
def save_canvas_token(body: TokenPayload, user_id: str = Depends(get_user_id)):
    if not body.token or not body.token.strip():
        # Input validation check
        raise HTTPException(status_code=400, detail="Canvas Token cannot be empty")

    
    db.tokens.update_one(
        {"user_id": user_id},
        {"$set": {"canvas_access_token": body.token}},
        upsert=True
    )

    return {"message": "Canvas token saved successfully"}

@router.get("/canvas/token")
def check_canvas_token_exists(user_id: str = Depends(get_user_id)):
    doc = db.tokens.find_one({"user_id": user_id}, {"_id": 1}) # Project only the ID for speed
    
    if not doc:
        # 404 is technically correct, but 401 Unauthorized might be better if tied to a protected page
        raise HTTPException(status_code=401, detail="No Canvas token found")
        
    return {"token_exists": True}

def get_decrypted_canvas_token_internal(user_id: str):
    doc = db.tokens.find_one({"user_id": user_id})
    if not doc:
        return None # Return None if token not found
    
    raw_token = doc.get("canvas_access_token")
    return raw_token

@router.delete("/canvas/token")
def delete_canvas_token(user_id: str = Depends(get_user_id)):
    db.tokens.delete_one({"user_id": user_id})
    return {"message": "Token deleted"}