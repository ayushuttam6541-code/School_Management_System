# 🎓 The Foundation Academy - School Management System

A complete full-stack web application for managing school operations, admissions, payments, and communication. Built with modern technologies for scalability and performance.

**Live Demo:** https://school-management-system-omega-blush.vercel.app

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Project Structure](#project-structure)

---

## 🎯 Project Overview

The Foundation Academy Management System is a comprehensive solution designed to:
- 📝 **Manage Admissions** - Online application submission and status tracking
- 💳 **Process Payments** - Secure fee collection with Stripe integration
- 📧 **Email Notifications** - Automated confirmations and updates via Resend
- 🔐 **Role-Based Access** - Admin, Student, Parent, Teacher dashboards
- 💬 **AI Chat Support** - Real-time assistance for visitors
- 📰 **News & Events** - Share announcements and events with stakeholders

---

## 🛠️ Tech Stack

### Backend
```
Framework:     FastAPI (Python - Async Web Framework)
Database:      MongoDB (NoSQL Document Database)
Async Driver:  Motor (Async MongoDB connector)
Authentication: JWT + Bcrypt (Secure password hashing)
Email Service: Resend (Email delivery)
Payments:      Stripe (Payment processing)
Server:        Uvicorn (ASGI server)
Environment:   python-dotenv (Configuration management)
```

### Frontend
```
Framework:     React 19 (UI Library)
Build Tool:    Vite (Lightning-fast bundler)
Routing:       React Router DOM (Client-side routing)
Styling:       Tailwind CSS + PostCSS (Utility-first CSS)
HTTP Client:   Axios (API calls)
Animations:    Framer Motion (Smooth UI animations)
Payments:      Stripe.js (Frontend payment integration)
Notifications: Sonner (Toast notifications)
Icons:         Phosphor Icons (Icon library)
Linting:       ESLint (Code quality)
```

---

## 🏗️ Backend Architecture

### Core Server Setup (`server.py`)

**What we use:**
- **FastAPI**: Modern, fast Python web framework with automatic API documentation
- **Motor**: Async MongoDB driver for non-blocking database operations
- **CORS Middleware**: Allows frontend to communicate with backend safely
- **Environment Variables**: Secure configuration via `.env` file


**Key Concepts:**

- **ProtectedRoute**: Component that checks user authentication + role
- **PublicLayout**: Header + Footer for public pages
- **DashboardLayout**: Sidebar + Header for authenticated users
- **Nested Routing**: Parent routes wrap child routes

---

### Authentication Context (`context/AuthContext.jsx`)

**React Context - Global State Management**

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app load, check if user is already logged in
    // JWT is in httpOnly cookie, sent automatically
    axiosInstance.get('/api/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/api/auth/login', {
      email, password
    });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await axiosInstance.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usage in components:
const { user, login, logout } = useContext(AuthContext);
```

**Why Context API?**
- Avoid prop drilling (passing data through many components)
- Global state for user info (no need to fetch on every page)
- Simple for small-medium apps

---

### Styling (`tailwind.config.js`)

**Tailwind CSS - Utility-First Framework**

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
        body: ['"Outfit"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        tfa: {  // "The Foundation Academy" branding
          blue: "#1E3A8A",         // Dark blue
          "blue-deep": "#0f1e5c",  // Deeper blue
          gold: "#D97706",         // Gold accent
          "gold-light": "#F59E0B", // Light gold
          cream: "#FEFCE8",        // Cream background
        },
      },
    },
  },
};
```

**Usage in Components:**
```javascript
<div className="bg-tfa-blue text-white p-4">
  <h1 className="font-display text-3xl">The Foundation Academy</h1>
  <p className="font-body text-tfa-gold-light">Quality Education</p>
</div>
```

**Why Tailwind?**
- Fast styling (no context switching to CSS files)
- Consistent design system (reusable class names)
- Small bundle size with tree-shaking
- Easy responsive design (mobile-first)

---

### API Communication

**Axios Setup** (`lib/api.js`)

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',  // Proxied to http://localhost:8000 by Vite
  withCredentials: true,  // Include cookies in requests
});

export default axiosInstance;
```

**Why axios?**
- Cookie handling (httpOnly cookies sent automatically)
- Request/response interceptors
- Better error handling than fetch
- Timeout support

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account (free tier available)
- Stripe account (free for testing)
- Resend account (free tier for emails)

### Backend Setup

1. **Clone & Navigate**
```bash
git clone <repo-url>
cd backend
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Create `.env` File**
```env
# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=school_management

# Authentication
JWT_SECRET=your-super-secret-key-change-this
ADMIN_EMAIL=admin@foundationacademy.in
ADMIN_PASSWORD=Admin@123

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend Email (Optional)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Security
COOKIE_SECURE=false  # true in production
```

5. **Start Backend**
```bash
python -m uvicorn server:app --reload
# API running on http://localhost:8000
# Docs available at http://localhost:8000/docs
```

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create `.env` File**
```env
VITE_API_URL=/api
```

4. **Start Development Server**
```bash
npm run dev
# Frontend running on http://localhost:5173
```

5. **Build for Production**
```bash
npm run build
# Output in dist/ folder
```

---

## 📚 API Documentation

### Auto-Generated Docs
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Test Credentials

**Admin User:**
```
Email: admin@foundationacademy.in
Password: Admin@123
Role: admin
```

**Demo Parent:**
```
Email: parent@foundationacademy.in
Password: Parent@123
Role: parent
```

**Demo Student:**
```
Email: student@foundationacademy.in
Password: Student@123
Role: student
```

---

## ✨ Features

### 🔐 Security
- ✅ JWT-based authentication with refresh tokens
- ✅ Bcrypt password hashing (industry standard)
- ✅ httpOnly cookies (prevent XSS attacks)
- ✅ CORS configuration (prevent CSRF)
- ✅ Role-based access control
- ✅ Stripe PCI compliance (we never see card data)

### 🚀 Performance
- ✅ Async/await throughout (non-blocking I/O)
- ✅ MongoDB indexes on frequently queried fields
- ✅ Vite for fast frontend builds
- ✅ React Router for instant page transitions (no full reload)
- ✅ Lazy component loading

### 📱 User Experience
- ✅ Responsive design (Tailwind CSS)
- ✅ Toast notifications (Sonner)
- ✅ Smooth animations (Framer Motion)
- ✅ Professional UI components
- ✅ Accessible icon library (Phosphor)

### 🔄 Integrations
- ✅ Stripe payments (₹ fees collection)
- ✅ Resend emails (confirmations, notifications)
- ✅ MongoDB (reliable database)
- ✅ Vercel deployment ready

---

## 📂 Project Structure

```
School_Management_System/
│
├── backend/
│   ├── server.py              # FastAPI app setup, middleware, startup
│   ├── auth_utils.py          # JWT, Bcrypt, authentication logic
│   ├── models.py              # Pydantic data validation models
│   ├── email_service.py       # Resend email templates
│   ├── requirements.txt       # Python dependencies
│   │
│   └── routes/
│       ├── auth_routes.py     # Register, login, logout, refresh
│       ├── admission_routes.py  # Apply, track, status update
│       ├── payment_routes.py   # Stripe checkout, status
│       ├── public_routes.py    # News, events, contact form
│       ├── chat_routes.py      # AI chat endpoints
│       └── dashboard_routes.py # User-specific dashboards
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main router configuration
│   │   ├── main.jsx           # React app entry point
│   │   ├── index.css          # Global styles
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Admissions.jsx
│   │   │   ├── Login.jsx
│   │   │   └── dashboard/     # Admin/Student/Parent/Teacher
│   │   │
│   │   ├── components/        # Reusable components
│   │   │   ├── layout/
│   │   │   │   ├── PublicLayout.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── ... other components
│   │   │
│   │   ├── context/           # React Context (global state)
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── lib/               # Utilities
│   │   │   └── api.js         # Axios instance
│   │   │
│   │   └── assets/            # Images, fonts, etc.
│   │
│   ├── vite.config.js         # Vite bundler setup
│   ├── tailwind.config.js     # Tailwind theme
│   ├── postcss.config.js      # CSS processing
│   ├── package.json           # NPM dependencies
│   └── index.html             # HTML template
│
└── README.md                   # This file
```

---

## 🔑 Key Concepts Explained

### Async/Await (Backend)
```python
# Without async: Blocks entire server while waiting for DB
user = db.users.find_one({"email": email})

# With async: Server can handle other requests
user = await db.users.find_one({"email": email})
```

### JWT Flow
```
1. User logs in
   └─> Server verifies password
       └─> Creates JWT = {"user_id": "123", "role": "admin", "exp": ...}
           └─> Signs with secret key
               └─> Returns as cookie

2. User makes request to protected endpoint
   └─> Browser automatically includes JWT cookie
       └─> Server verifies signature (didn't tamper with token)
           └─> Decodes to get user info
               └─> Checks expiration & role
                   └─> Grants or denies access
```

### MongoDB Document Example
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "student@example.com",
  "password_hash": "$2b$12$...",
  "name": "John Doe",
  "role": "student",
  "phone": "+91-9999999999",
  "created_at": "2026-08-07T10:00:00Z"
}
```

---

## 🚀 Deployment

### Backend (Render)
```bash
git push 
# or similar for your platform
```

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

---

## 🐛 Troubleshooting

**Backend not connecting?**
- Check MongoDB URL in `.env`
- Ensure IP address is whitelisted in MongoDB Atlas

**Frontend showing CORS error?**
- Check `CORS_ORIGINS` in backend `.env`
- Ensure it includes your frontend URL

**Emails not sending?**
- Verify `RESEND_API_KEY` in `.env`
- Check spam folder

**Payments not working?**
- Use Stripe test cards (4242 4242 4242 4242)
- Verify `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`

---

## 📄 License

This project is provided as-is for educational purposes.

---

## 👨‍💻 Developer

**Created by:** Ayush Raj 
**GitHub:** https://github.com/ayushuttam6541-code  
**Project:** School Management System for The Foundation Academy

---

## 📞 Support

For issues, questions, or suggestions:
- Email: kamalayush65@gmail.com
- Phone: +91-8709610659

---

**Happy coding! 🎓**
