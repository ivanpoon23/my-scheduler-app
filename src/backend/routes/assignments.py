from fastapi import APIRouter, Header, HTTPException
import requests
import os
from datetime import datetime, timedelta
import pytz


router = APIRouter()

@router.get("/assignments")
def get_all_assignments(authorization: str = Header(...), only_unsubmitted: bool = False):
    token = authorization.replace("Bearer ", "")
    headers = {"Authorization": f"Bearer {token}"}

    courses_res = requests.get(
        "https://canvas.instructure.com/api/v1/courses?enrollment_state=active",
        headers=headers
    )
    if not courses_res.ok:
        raise HTTPException(status_code=courses_res.status_code, detail="Failed to fetch courses")
    courses = courses_res.json()

    all_assignments = []

    for course in courses:
        course_id = course["id"]
        url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments?include[]=submission"
        res = requests.get(url, headers=headers)
        print(f"Fetching assignments for course: {course['name']} (ID: {course_id})")

        if not res.ok:
            continue  # skip this course if API fails

        assignments = res.json()
        if only_unsubmitted:
            # Keep assignments where has_submitted_submissions is False or missing
            assignments = [
                a for a in assignments
                if not a.get("has_submitted_submissions", False)
            ]

        #Sort assignments by due date, earliest first
        for a in assignments:
            a["course_name"] = course["name"]
            a["due"] = a.get("due_at")
            a["submission"] = a.get("has_submitted_submissions")
            # Ignore assignments without due dates and only include recent due dates (Current year)
            if a["due"]:
                due_date = datetime.fromisoformat(a["due"].replace("Z", "+00:00")).astimezone(pytz.timezone("America/Los_Angeles"))
                if due_date.year == datetime.now().year:
                    a["due"] = due_date.isoformat()
                    all_assignments.append(a)
    # print(f"First assignment fetched: {all_assignments[0] if all_assignments else 'No assignments found'}")
    return all_assignments

# Get assignments for a specific course
@router.get("/assignments/{course_id}")
def get_assignments_by_course(course_id: int, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    headers = {"Authorization": f"Bearer {token}"}

    url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments"
    res = requests.get(url, headers=headers)

    if not res.ok:
        raise HTTPException(status_code=res.status_code, detail="Failed to fetch assignments")

    assignments = res.json()
    return assignments