"""Dashboard routes for admin, student, parent, teacher."""
from fastapi import APIRouter, Depends
from auth_utils import get_current_user, require_role

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/admin/overview")
async def admin_overview(user=Depends(require_role("admin"))):
    from server import db
    admissions_total = await db.admissions.count_documents({})
    admissions_pending = await db.admissions.count_documents({"status": "pending"})
    admissions_approved = await db.admissions.count_documents({"status": "approved"})
    contacts_total = await db.contacts.count_documents({})
    users_total = await db.users.count_documents({})
    recent_admissions = await db.admissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(6)
    recent_contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(6)
    return {
        "stats": {
            "admissions_total": admissions_total,
            "admissions_pending": admissions_pending,
            "admissions_approved": admissions_approved,
            "contacts_total": contacts_total,
            "users_total": users_total,
        },
        "recent_admissions": recent_admissions,
        "recent_contacts": recent_contacts,
    }


@router.get("/student/overview")
async def student_overview(user=Depends(require_role("student"))):
    return {
        "user": user,
        "attendance_pct": 94,
        "upcoming_exams": [
            {"subject": "Mathematics", "date": "2026-03-05"},
            {"subject": "Science", "date": "2026-03-07"},
            {"subject": "English", "date": "2026-03-09"},
        ],
        "recent_marks": [
            {"subject": "Math", "score": 92, "max": 100},
            {"subject": "Science", "score": 88, "max": 100},
            {"subject": "English", "score": 90, "max": 100},
            {"subject": "Hindi", "score": 85, "max": 100},
        ],
        "homework": [
            {"subject": "Math", "task": "Chapter 5 exercises 1-15", "due": "Tomorrow"},
            {"subject": "Science", "task": "Read Chapter 4 and answer", "due": "In 3 days"},
        ],
    }


@router.get("/parent/overview")
async def parent_overview(user=Depends(require_role("parent"))):
    return {
        "user": user,
        "children": [
            {"name": "Aarav Sharma", "class": "V-A", "attendance": 96, "fee_due": 4500},
        ],
        "notices": [
            {"title": "Annual Sports Day", "date": "2026-03-15"},
            {"title": "Parent-Teacher Meeting", "date": "2026-02-28"},
        ],
    }


@router.get("/teacher/overview")
async def teacher_overview(user=Depends(require_role("teacher"))):
    return {
        "user": user,
        "classes": [
            {"class": "V-A", "subject": "Mathematics", "students": 32},
            {"class": "VI-B", "subject": "Mathematics", "students": 30},
        ],
        "todays_schedule": [
            {"time": "09:00", "class": "V-A", "subject": "Mathematics"},
            {"time": "11:00", "class": "VI-B", "subject": "Mathematics"},
        ],
        "pending_grading": 12,
    }
