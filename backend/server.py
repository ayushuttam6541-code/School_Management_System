"""The Foundation Academy - Main FastAPI server."""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

# ---- MongoDB ----
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---- FastAPI app ----
app = FastAPI(title="The Foundation Academy API")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Include routers ----
from routes.auth_routes import router as auth_router
from routes.admission_routes import router as admission_router
from routes.public_routes import router as public_router
from routes.chat_routes import router as chat_router
from routes.dashboard_routes import router as dashboard_router
from routes.payment_routes import router as payment_router

app.include_router(auth_router)
app.include_router(admission_router)
app.include_router(public_router)
app.include_router(chat_router)
app.include_router(dashboard_router)
app.include_router(payment_router)


@app.get("/api/")
async def root():
    return {"message": "The Foundation Academy API", "status": "ok"}


@app.get("/api/health")
async def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


# ---- Startup: seed admin, indexes ----
from auth_utils import hash_password, verify_password


@app.on_event("startup")
async def startup():
    # indexes
    await db.users.create_index("email", unique=True)
    await db.admissions.create_index("application_number", unique=True)
    await db.notices.create_index([("created_at", -1)])
    await db.payments.create_index("session_id", unique=True)

    # seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@foundationacademy.in").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Admin",
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "phone": "",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )

    # seed sample notices/events
    if await db.notices.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.notices.insert_many([
            {"id": str(uuid.uuid4()), "title": "Admissions Open for 2026-27",
             "body": "Applications are open for Nursery to Class VIII. Apply online today.",
             "category": "notice", "event_date": None, "created_at": now},
            {"id": str(uuid.uuid4()), "title": "Annual Sports Day 2026",
             "body": "Join us on 15th March 2026 for a day of athletic competitions and celebrations.",
             "category": "event", "event_date": "2026-03-15", "created_at": now},
            {"id": str(uuid.uuid4()), "title": "Parent-Teacher Meeting",
             "body": "PTM scheduled on 28th February 2026. Please confirm your attendance.",
             "category": "event", "event_date": "2026-02-28", "created_at": now},
            {"id": str(uuid.uuid4()), "title": "Winter Vacation Homework",
             "body": "Download the winter vacation assignment from student portal.",
             "category": "news", "event_date": None, "created_at": now},
        ])

    # seed a demo parent/student/teacher for testing
    demo_users = [
        ("parent@foundationacademy.in", "Parent@123", "Demo Parent", "parent"),
        ("student@foundationacademy.in", "Student@123", "Demo Student", "student"),
        ("teacher@foundationacademy.in", "Teacher@123", "Demo Teacher", "teacher"),
    ]
    for email, pwd, name, role in demo_users:
        if not await db.users.find_one({"email": email}):
            await db.users.insert_one({
                "id": str(uuid.uuid4()),
                "name": name,
                "email": email,
                "password_hash": hash_password(pwd),
                "role": role,
                "phone": "",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })


@app.on_event("shutdown")
async def shutdown():
    client.close()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
