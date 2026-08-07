"""AI Chat Assistant using Emergent LLM."""
import os
import uuid
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from models import ChatMessageIn

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

SYSTEM_PROMPT = """You are an AI Admission Assistant for The Foundation Academy, an English medium CBSE co-education school in Harnaut, Nalanda, Bihar (Chandi Road, PIN 803110). The school runs from Nursery to Class VIII.

Facilities include: Smart Digital Classrooms, Computer Lab, Online Exams, Monthly Assessment, Extra Classes for weak students, Personality Development, English Speaking, NEET & JEE Foundation, Olympiad prep, KVPY prep, Indoor/Outdoor Games, Arts, Dance, Yoga, Hostel and Transport.

Leadership: Principal Er. Khushboo Kumari, Director Kaushal Kumar, Management Director Raj Kumar.
Contact: 8986233963, 9006876172. YouTube: thefoundationacademy.

Answer parent queries about admissions, curriculum, fees, transport, hostel, activities, and school life. Keep answers concise (2-4 short paragraphs), warm and helpful. If you don't know a specific fee amount or exact date, encourage the parent to call the school or fill the admission inquiry form. Never invent specific numbers. Never say you are an AI language model — you are "TFA Assistant"."""


async def _get_llm_reply(session_id: str, message: str) -> str:
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="LLM not configured")

    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=SYSTEM_PROMPT,
        ).with_model("gemini", "gemini-3-flash-preview")
        return await chat.send_message(UserMessage(text=message))
    except ImportError:
        logger.warning("emergentintegrations not installed — using fallback response")
        return (
            "Thank you for your question! The Foundation Academy offers admissions from Nursery to Class VIII. "
            "For detailed information about fees, transport, or hostel, please call us at 8986233963 or 9006876172, "
            "or fill out our online admission form. We're happy to help!"
        )


@router.post("/send")
async def send(payload: ChatMessageIn):
    from server import db
    try:
        reply = await _get_llm_reply(payload.session_id, payload.message)
        # persist
        now = datetime.now(timezone.utc).isoformat()
        await db.chat_messages.insert_many([
            {"id": str(uuid.uuid4()), "session_id": payload.session_id,
             "role": "user", "content": payload.message, "created_at": now},
            {"id": str(uuid.uuid4()), "session_id": payload.session_id,
             "role": "assistant", "content": reply, "created_at": now},
        ])
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@router.get("/history/{session_id}")
async def history(session_id: str):
    from server import db
    msgs = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(200)
    return msgs
