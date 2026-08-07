"""Stripe payment routes for fee collection."""
import os
import uuid
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr
from email_service import send_payment_confirmation

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/payment", tags=["payment"])


class CheckoutRequest(BaseModel):
    amount: int  # in paise (INR smallest unit)
    description: str
    email: EmailStr
    student_name: str = ""
    fee_type: str = "monthly"  # admission | monthly | annual


def _stripe_configured() -> bool:
    return bool(os.environ.get("STRIPE_SECRET_KEY"))


def _get_stripe():
    import stripe
    stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
    return stripe


@router.post("/create-checkout")
async def create_checkout(payload: CheckoutRequest):
    if not _stripe_configured():
        raise HTTPException(
            status_code=503,
            detail="Payment system not configured. Please contact the school office.",
        )
    if payload.amount < 100:
        raise HTTPException(status_code=400, detail="Minimum payment amount is ₹1")

    stripe = _get_stripe()
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "inr",
                    "product_data": {
                        "name": payload.description,
                        "description": f"Student: {payload.student_name}" if payload.student_name else "The Foundation Academy",
                    },
                    "unit_amount": payload.amount,
                },
                "quantity": 1,
            }],
            mode="payment",
            customer_email=payload.email,
            success_url=f"{frontend_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_url}/fees?cancelled=true",
            metadata={
                "student_name": payload.student_name,
                "fee_type": payload.fee_type,
                "email": payload.email,
            },
        )

        from server import db
        await db.payments.insert_one({
            "id": str(uuid.uuid4()),
            "session_id": session.id,
            "amount": payload.amount,
            "description": payload.description,
            "email": payload.email,
            "student_name": payload.student_name,
            "fee_type": payload.fee_type,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

        return {"checkout_url": session.url, "session_id": session.id}
    except Exception as e:
        logger.error("Stripe checkout error: %s", e)
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")


@router.get("/status/{session_id}")
async def payment_status(session_id: str):
    from server import db
    doc = await db.payments.find_one({"session_id": session_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Payment not found")

    if doc["status"] == "pending" and _stripe_configured():
        try:
            stripe = _get_stripe()
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == "paid":
                await db.payments.update_one(
                    {"session_id": session_id},
                    {"$set": {"status": "paid", "paid_at": datetime.now(timezone.utc).isoformat()}},
                )
                doc["status"] = "paid"
                await send_payment_confirmation(
                    doc["email"],
                    doc["amount"] / 100,
                    doc["description"],
                    session_id[:20],
                )
        except Exception as e:
            logger.error("Stripe status check error: %s", e)

    return {"status": doc["status"], "amount": doc["amount"], "description": doc["description"]}


@router.get("/config")
async def payment_config():
    return {
        "enabled": _stripe_configured(),
        "publishable_key": os.environ.get("STRIPE_PUBLISHABLE_KEY", ""),
    }
