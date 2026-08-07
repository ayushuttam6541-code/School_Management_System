"""Public routes: contact form, notices/events list, faculty, gallery meta."""
import uuid
from datetime import datetime, timezone
from typing import Optional, Literal
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from models import ContactInquiry, NoticeCreate
from auth_utils import require_role

router = APIRouter(prefix="/api", tags=["public"])


class ContactStatusUpdate(BaseModel):
    status: Literal["new", "read", "replied"]


@router.post("/contact")
async def contact(payload: ContactInquiry):
    from server import db
    doc = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "new",
        **payload.model_dump(),
    }
    await db.contacts.insert_one(doc)
    doc.pop("_id", None)
    return {"ok": True, "message": "Thank you! We'll get back to you soon.", "id": doc["id"]}


@router.get("/contacts/list")
async def list_contacts(user=Depends(require_role("admin"))):
    from server import db
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items


@router.patch("/contacts/{contact_id}/status")
async def update_contact_status(
    contact_id: str,
    payload: ContactStatusUpdate,
    user=Depends(require_role("admin")),
):
    from server import db
    result = await db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"status": payload.status}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"ok": True}


@router.get("/notices")
async def list_notices():
    from server import db
    items = await db.notices.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return items


@router.post("/notices")
async def create_notice(payload: NoticeCreate, user=Depends(require_role("admin"))):
    from server import db
    doc = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now(timezone.utc).isoformat(),
        **payload.model_dump(),
    }
    await db.notices.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.get("/stats/public")
async def public_stats():
    """Homepage school statistics."""
    return {
        "students": 850,
        "teachers": 45,
        "years": 12,
        "success_rate": 98,
    }


@router.get("/faculty")
async def faculty():
    return [
        {"name": "Er. Khushboo Kumari", "role": "Principal", "subject": "Administration",
         "bio": "M.Tech, 15+ years in education leadership."},
        {"name": "Kaushal Kumar", "role": "Director", "subject": "Strategy",
         "bio": "Founder & Director, passionate about foundational learning."},
        {"name": "Raj Kumar", "role": "Management Director", "subject": "Operations",
         "bio": "Overseeing daily operations and school growth."},
        {"name": "Anita Sharma", "role": "Sr. Teacher", "subject": "Mathematics",
         "bio": "M.Sc Mathematics, 10+ years teaching CBSE curriculum."},
        {"name": "Rohit Verma", "role": "Sr. Teacher", "subject": "Science",
         "bio": "M.Sc Physics, specializes in NEET/JEE foundation."},
        {"name": "Priya Singh", "role": "Teacher", "subject": "English",
         "bio": "MA English, focus on communication & personality development."},
    ]
