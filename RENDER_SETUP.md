# Render Deployment Setup Guide

## Backend Environment Variables

For the backend to work correctly on Render, you MUST set these environment variables in your Render dashboard:

### Required Environment Variables:

1. **MONGO_URL** - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/school_db`

2. **DB_NAME** - Your database name
   - Example: `school_management`

3. **JWT_SECRET** - A strong random string for JWT token signing
   - Generate one using: `openssl rand -base64 32`
   - Example: `your-super-secret-jwt-key-change-this-in-production`

4. **CORS_ORIGINS** - Comma-separated list of allowed frontend domains
   - **IMPORTANT**: Must include your frontend URL
   - Example: `https://your-frontend-domain.com,https://school-management-system-0nfa.onrender.com`

5. **COOKIE_SECURE** - Set to `true` for production/HTTPS
   - This is CRITICAL for cross-origin cookie handling
   - Set to: `true`

6. **ADMIN_EMAIL** - Admin user email
   - Example: `admin@foundationacademy.in`

7. **ADMIN_PASSWORD** - Admin user password
   - Example: `Admin@123`

## Frontend Environment Variables

Update your frontend `.env` file:

```
VITE_BACKEND_URL=https://school-management-system-0nfa.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Why This Fixes the 401 Error

The 401 error occurs because:

1. **Cross-Origin Cookies**: When frontend and backend are on different domains, browsers require specific cookie settings
2. **SameSite Attribute**: Must be set to `none` for cross-origin cookies
3. **Secure Flag**: Must be `true` when using `SameSite=none`
4. **CORS Configuration**: Backend must explicitly allow your frontend domain

The `COOKIE_SECURE=true` setting enables:
- `Secure` flag on cookies (HTTPS only)
- `SameSite=none` attribute (cross-origin compatible)
- Proper CORS handling for credentials

## Testing the Fix

After setting these environment variables on Render:

1. Redeploy your backend service
2. Clear your browser cookies for the domain
3. Try logging in again
4. Dashboard should load without 401 errors

## Local Development

For local development, keep `COOKIE_SECURE=false` and use:
```
VITE_BACKEND_URL=http://localhost:8000
```
