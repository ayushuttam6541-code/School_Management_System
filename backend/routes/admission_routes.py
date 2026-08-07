"""Admission routes: submit application, track status, list/manage (admin)."""
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from models import AdmissionApplication, AdmissionStatusUpdate
from auth_utils import get_current_user, require_role

router = APIRouter(prefix="/api/admission", tags=["admission"])


def _gen_app_number(seq: int) -> str:
    year = datetime.now().year
    return f"TFA-{year}-{seq:05d}"


@router.post("/apply")
async def submit_application(payload: AdmissionApplication):
    from server import db
    # Sequence via counters collection
    counter = await db.counters.find_one_and_update(
        {"_id": "admissions"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    seq = counter["seq"] if counter and "seq" in counter else 1
    app_number = _gen_app_number(seq)
    doc = {
        "id": str(uuid.uuid4()),
        "application_number": app_number,
        "status": "pending",
        "remarks": "",
        "created_at": datetime.now(timezone.utc).isoformat(),
        **payload.model_dump(),
    }
    await db.admissions.insert_one(doc)
    doc.pop("_id", None)

    # Send confirmation email via Resend
    from email_service import send_admission_confirmation
    await send_admission_confirmation(
        payload.parent_email,
        payload.student_name,
        app_number,
        payload.class_applying,
    )

    return doc


@router.get("/track/{application_number}")
async def track(application_number: str):
    from server import db
    doc = await db.admissions.find_one(
        {"application_number": application_number}, {"_id": 0}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Application not found")
    return doc


@router.get("/list")
async def list_applications(status: Optional[str] = None, user=Depends(require_role("admin"))):
    from server import db
    query = {}
    if status:
        query["status"] = status
    items = await db.admissions.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@router.patch("/{application_id}/status")
async def update_status(
    application_id: str,
    payload: AdmissionStatusUpdate,
    user=Depends(require_role("admin")),
):
    from server import db
    result = await db.admissions.update_one(
        {"id": application_id},
        {"$set": {"status": payload.status, "remarks": payload.remarks or ""}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"ok": True}


@router.get("/stats")
async def stats(user=Depends(require_role("admin"))):
    from server import db
    pipeline = [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
    agg = await db.admissions.aggregate(pipeline).to_list(50)
    by_status = {row["_id"]: row["count"] for row in agg}
    total = sum(by_status.values())
    return {"total": total, "by_status": by_status}
