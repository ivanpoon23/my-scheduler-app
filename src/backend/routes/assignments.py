from fastapi import APIRouter, Depends, HTTPException
import requests
import os
from datetime import datetime
import pytz
from typing import List, Dict, Any, Set
from db import db

router = APIRouter()
done_assignments: Set[int] = set() 

def get_user_id():
    return "demo-user"

def get_canvas_token(user_id: str = Depends(get_user_id)):
    doc = db.tokens.find_one({"user_id": user_id})
    if not doc:
        raise HTTPException(status_code=401, detail="No Canvas token found. Please upload one.")
    return doc.get("canvas_access_token", doc.get("token"))

@router.get("/courses")
def get_courses(token: str = Depends(get_canvas_token)):
    headers = {"Authorization": f"Bearer {token}"}
    courses_res = requests.get(
        "https://canvas.instructure.com/api/v1/courses?enrollment_state=active",
        headers=headers
    )

    if not courses_res.ok:
        raise HTTPException(status_code=courses_res.status_code, detail="Failed to fetch courses")

    courses = courses_res.json()

    current_year = datetime.now().year
    courses = [
        c for c in courses
        if c.get("created_at") is None
        or datetime.fromisoformat(c["created_at"].replace("Z", "+00:00")).year == current_year
    ]
    return courses

def translate_assignment(raw_assignment: Dict[str, Any], course_name: str, local_tz: pytz.tzinfo) -> Dict[str, Any] | None:
    """
    Translates a raw Canvas assignment object into the standardized, localized format.
    Returns None if the assignment is in the past or has no due date.
    """
    due_at_str = raw_assignment.get("due_at")
    
    if not due_at_str:
        return None

    due_dt_utc = datetime.fromisoformat(due_at_str.replace("Z", "+00:00"))
    due_dt_local = due_dt_utc.astimezone(local_tz)
    now_local = datetime.now(local_tz)

    if now_local > due_dt_local:
        return None

    translated = {
        "id": raw_assignment.get("id"),
        "title": raw_assignment.get("name") or raw_assignment.get("title"), # Use 'name' first, if available
        "due": due_dt_local.isoformat(), # Localized ISO string for frontend
        "course": course_name,
        "submission": raw_assignment.get("submission"),
        "has_submitted_submissions": raw_assignment.get("has_submitted_submissions", False),
        "done": raw_assignment.get("done", False),
    }

    return translated


@router.get("/assignments", response_model=List[Dict[str, Any]])
def get_all_assignments(
    only_unsubmitted: bool = False,
    token: str = Depends(get_canvas_token),
    courses: list = Depends(get_courses)
):
    headers = {"Authorization": f"Bearer {token}"}
    all_assignments = []
    
    local_tz = pytz.timezone(os.getenv("LOCAL_TIMEZONE", "UTC"))

    for course in courses:
        course_id = course["id"]
        url = (
            f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments"
            "?include[]=submission"
            "&include[]=all_dates"
            "&per_page=100" 
        )
        res = requests.get(url, headers=headers)

        if not res.ok:
            continue

        assignments = res.json()
        course_name = course["name"]

        for raw_assignment in assignments:
            
            is_submitted = raw_assignment.get("has_submitted_submissions", False)
            is_marked_done = raw_assignment.get("id") in done_assignments

            if only_unsubmitted and (is_submitted or is_marked_done):
                continue
            translated = translate_assignment(raw_assignment, course_name, local_tz)
            # Print coursename and translated for debugging
            if translated:
                all_assignments.append(translated)

    all_assignments.sort(
        key=lambda x: x["due"] if x["due"] else "9999-12-31T23:59:59+00:00"
    )
    # Print all assignments course names for debugging
    # print(all_assignments)
    return all_assignments

@router.get("/assignments/{course_id}")
def get_assignments_by_course(course_id: int, token: str = Depends(get_canvas_token)):
    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments"

    res = requests.get(url, headers=headers)

    if not res.ok:
        raise HTTPException(status_code=res.status_code, detail="Failed to fetch assignments")

    return res.json()

done_assignments = set()

@router.post("/assignments/{assignment_title}/done")
def mark_assignment_done(assignment_title: str):
    print(f"Marking assignment {assignment_title} as done")
    done_assignments.add(assignment_title)
    return {"message": f"Assignment {assignment_title} marked as done."}
