from fastapi import APIRouter, Depends, Header, HTTPException
import requests
import os
from datetime import datetime, timedelta
import pytz


router = APIRouter()
@router.get("/courses")
def get_courses(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    headers = {"Authorization": f"Bearer {token}"}
    courses_res = requests.get(
        "https://canvas.instructure.com/api/v1/courses?enrollment_state=active",
        headers=headers
    )
    if not courses_res.ok:
        raise HTTPException(status_code=courses_res.status_code, detail="Failed to fetch courses")
    courses = courses_res.json()
    # Filter active courses if start_at was created this year
    courses = [c for c in courses if c.get("created_at") == None or datetime.fromisoformat(c["created_at"].replace("Z", "+00:00")).year == datetime.now().year]
    return courses

@router.get("/assignments")
def get_all_assignments(authorization: str = Header(...), only_unsubmitted: bool = False, courses: list = Depends(get_courses)):
    token = authorization.replace("Bearer ", "")
    headers = {"Authorization": f"Bearer {token}"}
    all_assignments = []

    for course in courses:
        course_id = course["id"]
        url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments?include[]=submission"
        res = requests.get(url, headers=headers)
        
        # print(f"Fetching assignments for course: {course['name']} (ID: {course_id})")
        print(url)
        if not res.ok:
            continue  # skip this course if API fails

        assignments = res.json()
        if only_unsubmitted:
            # Keep assignments where has_submitted_submissions is False or missing or not marked as done
            assignments = [
                a for a in assignments
                if not a.get("has_submitted_submissions", False) and a["id"] not in done_assignments
            ]

        for a in assignments:
            a["course_name"] = course["name"]
            a["due"] = a.get("due_at")
            a["submission"] = a.get("has_submitted_submissions")
            a["done"] = a.get("done", False)
            # Skip assignments with no due date
            if not a["due"]:
                continue
            # Convert due date to local timezone
            due_date = datetime.fromisoformat(a["due"].replace("Z", "+00:00"))
            local_tz = pytz.timezone(os.getenv("LOCAL_TIMEZONE", "UTC"))
            a["due"] = due_date.astimezone(local_tz).isoformat()
        assignments.sort(key=lambda x: x["due"] if x["due"] else "9999-12-31T23:59:59+00:00")
        all_assignments.extend(assignments)
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

# Mark an assignment as done (for local tracking purposes)
done_assignments = set()
@router.post("/assignments/{assignment_title}/done")
def mark_assignment_done(assignment_title: str):
    print(f"Marking assignment {assignment_title} as done")
    done_assignments.add(assignment_title)
    return {"message": f"Assignment {assignment_title} marked as done."}