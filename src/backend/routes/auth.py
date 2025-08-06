# backend/routes/auth.py
import os, requests
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

router = APIRouter()
CLIENT_ID = os.getenv("CANVAS_CLIENT_ID")
CLIENT_SECRET = os.getenv("CANVAS_CLIENT_SECRET")
REDIRECT_URI = os.getenv("CANVAS_REDIRECT_URI")

@router.get("/oauth/callback")
async def oauth_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return {"error": "No code in request"}

    token_url = "https://canvas.instructure.com/login/oauth2/token"
    data = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "code": code,
    }

    resp = requests.post(token_url, data=data)
    token_data = resp.json()
    access_token = token_data.get("access_token")

    # Redirect back to frontend with token (or store it server-side if you have a session)
    return RedirectResponse(f"http://localhost:5173?token={access_token}")
