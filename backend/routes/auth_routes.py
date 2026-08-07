"""Auth routes: register, login, logout, me, refresh."""
import os
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Response, Request, Depends
from models import UserRegister, UserLogin, UserOut
from auth_utils import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
    get_current_user,
)
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _cookie_secure() -> bool:
    return os.environ.get("COOKIE_SECURE", "false").lower() == "true"


def _set_cookies(response: Response, access: str, refresh: str):
    secure = _cookie_secure()
    response.set_cookie("access_token", access, httponly=True, secure=secure,
                        samesite="lax" if not secure else "none", max_age=8 * 3600, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=secure,
                        samesite="lax" if not secure else "none", max_age=7 * 86400, path="/")


@router.post("/register")
async def register(payload: UserRegister, response: Response):
    from server import db
    email = payload.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": email,
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "phone": payload.phone or "",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    access = create_access_token(user_doc["id"], email, payload.role)
    refresh = create_refresh_token(user_doc["id"])
    _set_cookies(response, access, refresh)
    user_doc.pop("password_hash")
    user_doc.pop("_id", None)
    return user_doc


@router.post("/login")
async def login(payload: UserLogin, response: Response):
    from server import db
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access = create_access_token(user["id"], email, user["role"])
    refresh = create_refresh_token(user["id"])
    _set_cookies(response, access, refresh)
    user.pop("password_hash", None)
    user.pop("_id", None)
    return user


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@router.get("/me")
async def me(user=Depends(get_current_user)):
    return user


@router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        from server import db
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(user["id"], user["email"], user["role"])
        secure = _cookie_secure()
        response.set_cookie("access_token", access, httponly=True, secure=secure,
                            samesite="lax" if not secure else "none", max_age=8 * 3600, path="/")
        return {"ok": True}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
