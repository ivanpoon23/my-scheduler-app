from fastapi import APIRouter, Header, HTTPException
import requests
import os

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
def get_assignments():
    return [
        {
            "id": 1,
            "title": "Dummy Assignment 1",
            "due": "2025-08-12T23:59:00Z",
            "submission": None
        },
        {
            "id": 2,
            "title": "Submitted Assignment",
            "due": "2025-08-10T12:00:00Z",
            "submission": {
                "workflow_state": "submitted",
                "submitted_at": "2025-08-09T17:00:00Z"
            }
        }
    ]

