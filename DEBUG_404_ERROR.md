# Debug 404 Error Guide

## Current Issue
Users are experiencing 404 errors when trying to load the dashboard after authentication.

## Debugging Steps Added

I've added debugging logs to help identify the exact issue:

### 1. API Configuration Debugging
Modified `frontend/src/lib/api.js` to log:
- Backend URL configuration
- API base URL
- Every API request made
- API responses and errors

### 2. Dashboard Component Debugging  
Modified `frontend/src/pages/dashboard/ParentDashboard.jsx` to log:
- Dashboard data received
- Detailed error information

## How to Debug

### Step 1: Check Browser Console
1. Open your browser DevTools (F12)
2. Go to the Console tab
3. Login to the application
4. Navigate to the dashboard
5. Look for these console logs:
   - "API Configuration:" - Shows what backend URL is being used
   - "API Request:" - Shows each API call being made
   - "API Error:" - Shows any errors that occur
   - "Dashboard data received:" or "Dashboard load error:"

### Step 2: Identify the Issue

**If you see:**
```
API Configuration:
BACKEND_URL: 
API: /api
```
This means the environment variable is not being read correctly. The frontend is trying to use relative paths.

**If you see:**
```
API Request: GET https://school-management-system-0nfa.onrender.com/api/dashboard/parent/overview
API Error: 404 /api/dashboard/parent/overview
```
This means the backend endpoint doesn't exist or the backend is not accessible.

**If you see:**
```
API Request: GET http://localhost:8000/api/dashboard/parent/overview
```
This means the frontend is still using localhost instead of the production URL.

## Common Issues and Solutions

### Issue 1: Environment Variable Not Being Read
**Problem:** Frontend not reading `VITE_BACKEND_URL` from `.env`

**Solution:**
1. Make sure `frontend/.env` file exists with:
   ```
   VITE_BACKEND_URL=https://school-management-system-0nfa.onrender.com
   ```
2. Restart the frontend development server
3. For production, ensure Render environment variables are set in `render.yaml`

### Issue 2: Backend Not Accessible
**Problem:** Backend server is down or not responding

**Solution:**
1. Check if backend is running on Render
2. Check Render logs for any errors
3. Verify backend environment variables are set correctly (MONGO_URL, JWT_SECRET, etc.)

### Issue 3: Route Configuration Issue
**Problem:** Frontend requesting wrong endpoint path

**Solution:**
The correct endpoint is: `/api/dashboard/parent/overview`
- Base URL: `https://school-management-system-0nfa.onrender.com`
- Full URL: `https://school-management-system-0nfa.onrender.com/api/dashboard/parent/overview`

### Issue 4: CORS Issues
**Problem:** Browser blocking requests due to CORS

**Solution:**
1. Ensure backend has `CORS_ORIGINS` set to include your frontend domain
2. Ensure `COOKIE_SECURE=true` is set in backend environment variables

## Testing API Directly

You can test the backend API directly using curl or a tool like Postman:

```bash
# Test health endpoint
curl https://school-management-system-0nfa.onrender.com/api/health

# Test dashboard endpoint (requires authentication)
curl -X GET https://school-management-system-0nfa.onrender.com/api/dashboard/parent/overview \
  -H "Cookie: access_token=YOUR_TOKEN"
```

## Next Steps

1. **Check the browser console** logs using the debugging I added
2. **Share the console output** so I can identify the exact issue
3. **Verify the frontend build** includes the correct environment variables
4. **Check backend logs** on Render for any errors

The debugging logs will tell us exactly what's happening and help fix the 404 error.
