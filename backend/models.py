"""Pydantic models for The Foundation Academy backend."""
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Literal
from pydantic import BaseModel, Field, EmailStr, ConfigDict


def _now():
    return datetime.now(timezone.utc).isoformat()


def _uid():
    return str(uuid.uuid4())


# ============ Users / Auth ============
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: Literal["student", "parent", "teacher"] = "parent"
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    created_at: str


# ============ Admission ============
class AdmissionApplication(BaseModel):
    # Student
    student_name: str
    date_of_birth: str
    gender: Literal["male", "female", "other"]
    class_applying: str
    previous_school: Optional[str] = ""
    blood_group: Optional[str] = ""
    # Parents
    father_name: str
    father_occupation: Optional[str] = ""
    mother_name: str
    mother_occupation: Optional[str] = ""
    parent_email: EmailStr
    parent_phone: str
    emergency_contact: str
    # Address
    address: str
    city: str
    state: str
    pincode: str
    # Options
    transport_required: bool = False
    hostel_required: bool = False
    medical_conditions: Optional[str] = ""
    # Docs (URLs or base64 references, kept as strings for MVP)
    student_photo: Optional[str] = ""
    birth_certificate: Optional[str] = ""
    aadhar: Optional[str] = ""


class AdmissionOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    application_number: str
    status: str
    student_name: str
    class_applying: str
    parent_email: str
    parent_phone: str
    created_at: str


class AdmissionStatusUpdate(BaseModel):
    status: Literal["pending", "under_review", "approved", "rejected", "waitlisted"]
    remarks: Optional[str] = ""


# ============ Contact / Inquiry ============
class ContactInquiry(BaseModel):
    name: str
    email: EmailStr
    phone: str
    subject: str
    message: str


# ============ Chat ============
class ChatMessageIn(BaseModel):
    session_id: str
    message: str


# ============ Events / Notices ============
class NoticeCreate(BaseModel):
    title: str
    body: str
    category: Literal["notice", "news", "event"] = "notice"
    event_date: Optional[str] = None
