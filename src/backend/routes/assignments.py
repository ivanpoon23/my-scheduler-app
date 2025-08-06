from fastapi import APIRouter, Header, HTTPException
import requests
import os
from datetime import datetime, timedelta


router = APIRouter()

@router.get("/assignments")
def get_all_assignments(authorization: str = Header(...), only_unsubmitted: bool = False):
    token = authorization.replace("Bearer ", "")
    headers = {
        "Authorization": f"Bearer {token}"
    }

    courses = requests.get("https://canvas.instructure.com/api/v1/courses?enrollment_state=active", headers=headers).json()
    all_assignments = []

    for course in courses:
        course_id = course["id"]
        url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments?include[]=submission"
        res = requests.get(url, headers=headers)

        if res.ok:
            assignments = res.json()

            if only_unsubmitted:
                assignments = [a for a in assignments if not a.get("submission") or a["submission"]["workflow_state"] != "submitted"]

            for a in assignments:
                a["course_name"] = course["name"]
                all_assignments.append(a)

    return all_assignments


@router.get("/getdummyassignments")
def get_dummy_assignments():
    now = datetime.utcnow()
    return [
        {
            "id": 1,
            "title": "Read Chapter 4",
            "course_name": "World History",
            "due": (now + timedelta(days=2)).isoformat() + "Z",
            "submission": None
        },
        {
            "id": 2,
            "title": "Problem Set 5",
            "course_name": "Calculus",
            "due": (now + timedelta(days=4)).isoformat() + "Z",
            "submission": {
                "workflow_state": "submitted",
                "submitted_at": (now + timedelta(days=3)).isoformat() + "Z"
            }
        },
        {
            "id": 3,
            "title": "Research Paper Draft",
            "course_name": "English Literature",
            "due": (now + timedelta(days=6)).isoformat() + "Z",
            "submission": None
        }
    ]

