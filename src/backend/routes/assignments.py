from fastapi import APIRouter, Header, HTTPException
import requests
import os

router = APIRouter()

@router.get("/assignments")
def get_assignments(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # You can change this to /assignments if you want more data
    r = requests.get("https://canvas.instructure.com/api/v1/users/self/upcoming_events", headers=headers)

    if not r.ok:
        raise HTTPException(status_code=r.status_code, detail=r.text)

    return r.json()

# @router.get("/assignments")
# def get_assignments():
#     return [
#         {
#             "title": "Dummy Assignment",
#             "start_at": "2025-08-07T23:59:00Z"
#         },
#         {
#             "title": "Mock Quiz",
#             "start_at": "2025-08-10T12:00:00Z"
#         }
#     ]
