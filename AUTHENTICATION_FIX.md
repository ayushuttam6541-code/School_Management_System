# Authentication 401 Error Fix

## Problem Summary

Users were experiencing 401 errors when trying to load the dashboard after authentication:
```
Failed to load resource: the server responded with a status of 401 ()
school-management-system-0nfa.onrender.com/api/dashboard/parent/overview:1 Failed to load resource: the server responded with a status of 401 ()
```

## Root Cause Analysis

The issue was caused by **CORS and cookie configuration mismatch** when the frontend and backend are deployed on different domains (like Render).

### Technical Details:

1. **Cross-Origin Cookie Restrictions**: When frontend and backend are on different domains, browsers have strict security policies for cookies
2. **SameSite Cookie Attribute**: The backend was setting cookies with `samesite="lax"` which doesn't work for cross-origin requests
3. **Secure Cookie Flag**: Cross-origin cookies with `SameSite=none` require the `secure=true` flag
4. **Missing Environment Configuration**: The backend wasn't configured with proper environment variables for production

### Authentication Flow:

The backend correctly:
- Sets `access_token` and `refresh_token` cookies on login/register
- Expects these cookies to be sent with subsequent requests
- Uses them to authenticate users via `get_current_user()` in `auth_utils.py`

However, the browser wasn't sending the cookies because:
- Cookie attributes weren't compatible with cross-origin requests
- CORS origins weren't properly configured
- `COOKIE_SECURE` wasn't set to `true` for production

## Solution Implemented

### 1. Frontend Configuration Update

Updated `frontend/.env` to point to the correct backend URL:
```
VITE_BACKEND_URL=https://school-management-system-0nfa.onrender.com
```

### 2. Backend Environment Variables Setup

Created comprehensive setup guide in `RENDER_SETUP.md` with required environment variables:

**Critical Variables for Production:**
- `COOKIE_SECURE=true` - Enables secure cookies and `SameSite=none` for cross-origin
- `CORS_ORIGINS` - Must include frontend domain(s)
- `JWT_SECRET` - Strong secret for token signing
- `MONGO_URL` - Database connection
- `DB_NAME` - Database name

### 3. Cookie Configuration Logic

The backend already has the correct logic in `backend/routes/auth_routes.py`:

```python
def _cookie_secure() -> bool:
    return os.environ.get("COOKIE_SECURE", "false").lower() == "true"

def _set_cookies(response: Response, access: str, refresh: str):
    secure = _cookie_secure()
    response.set_cookie("access_token", access, httponly=True, secure=secure,
                        samesite="lax" if not secure else "none", max_age=8 * 3600, path="/")
```

When `COOKIE_SECURE=true`:
- Sets `secure=true` on cookies (HTTPS only)
- Sets `samesite="none"` (cross-origin compatible)
- Enables proper CORS credential handling

## Implementation Steps

### For Production (Render):

1. **Set Environment Variables in Render Dashboard:**
   - Go to your Render backend service
   - Add the environment variables listed in `RENDER_SETUP.md`
   - **CRITICAL**: Set `COOKIE_SECURE=true`
   - **CRITICAL**: Set `CORS_ORIGINS` to include your frontend domain

2. **Update Frontend Environment:**
   - Set `VITE_BACKEND_URL=https://school-management-system-0nfa.onrender.com`

3. **Redeploy Services:**
   - Redeploy backend to apply environment variables
   - Redeploy frontend to apply backend URL change

4. **Clear Browser Data:**
   - Clear cookies for both domains
   - Test authentication flow

### For Local Development:

Keep these settings:
- `COOKIE_SECURE=false` in backend
- `VITE_BACKEND_URL=http://localhost:8000` in frontend

## Files Modified

1. **frontend/.env** - Updated backend URL for production
2. **RENDER_SETUP.md** - Created comprehensive deployment guide
3. **AUTHENTICATION_FIX.md** - This documentation file

## Testing the Fix

After implementing the environment variables:

1. Login with valid credentials
2. Check browser DevTools > Application > Cookies
3. Verify `access_token` and `refresh_token` cookies are set
4. Navigate to dashboard
5. Verify dashboard loads without 401 errors

## Code References

- **Backend Auth Utils**: `backend/auth_utils.py` - Token handling and user authentication
- **Backend Auth Routes**: `backend/routes/auth_routes.py` - Login/register/logout endpoints
- **Backend Dashboard Routes**: `backend/routes/dashboard_routes.py` - Protected dashboard endpoints
- **Frontend Auth Context**: `frontend/src/context/AuthContext.jsx` - Authentication state management
- **Frontend API Client**: `frontend/src/lib/api.js` - Axios configuration with credentials

## Security Considerations

- **JWT Secret**: Use a strong, random secret in production
- **Cookie Security**: Always use `secure=true` in production (HTTPS)
- **CORS Origins**: Only allow specific domains, not `*`
- **Token Expiration**: Access tokens expire in 8 hours, refresh tokens in 7 days
- **HttpOnly Cookies**: Prevents XSS attacks on tokens
