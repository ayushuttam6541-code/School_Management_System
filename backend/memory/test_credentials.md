# The Foundation Academy - Test Credentials

Use these to log in for testing. All accounts are seeded on backend startup.

| Role     | Email                              | Password    |
|----------|------------------------------------|-------------|
| Admin    | admin@foundationacademy.in         | Admin@123   |
| Parent   | parent@foundationacademy.in        | Parent@123  |
| Student  | student@foundationacademy.in       | Student@123 |
| Teacher  | teacher@foundationacademy.in       | Teacher@123 |

## Auth Endpoints
- POST `/api/auth/login`      body: `{ "email", "password" }`  (sets httpOnly cookies)
- POST `/api/auth/register`   body: `{ "name", "email", "password", "role", "phone" }`
- GET  `/api/auth/me`         requires cookie
- POST `/api/auth/logout`
- POST `/api/auth/refresh`

## Other Key Endpoints
- POST `/api/admission/apply` — submit admission form (public)
- GET  `/api/admission/track/{application_number}` — track status (public)
- GET  `/api/admission/list`  — admin only
- PATCH `/api/admission/{id}/status` — admin only
- POST `/api/contact` — inquiry form (public)
- POST `/api/chat/send` — AI assistant (public)
- GET  `/api/dashboard/admin/overview`   — admin only
- GET  `/api/dashboard/student/overview` — student only
- GET  `/api/dashboard/parent/overview`  — parent only
- GET  `/api/dashboard/teacher/overview` — teacher only
