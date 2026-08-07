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

**Key Features:**
```python
# MongoDB Async Connection
client = AsyncIOMotorClient(mongo_url)
db = client[DB_NAME]

# FastAPI App Setup
app = FastAPI(title="The Foundation Academy API")

# CORS Configuration
app.add_middleware(CORSMiddleware, ...)

# Auto-seed Admin & Demo Users on Startup
@app.on_event("startup")
async def startup():
    # Create database indexes for faster queries
    # Seed admin user with default credentials
    # Seed demo users (parent, student, teacher) for testing
```

---

### Authentication System (`auth_utils.py`)

**How it works:**

#### 1. **Password Hashing with Bcrypt**
```python
def hash_password(password: str) -> str:
    # One-way encryption - even we can't decrypt it
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def verify_password(plain: str, hashed: str) -> bool:
    # Compares plain password with hashed version safely
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
```

**Why Bcrypt?**
- Salt: Random data added to password before hashing (prevents rainbow table attacks)
- Slow hashing: Takes ~0.1 seconds per password (brute force nearly impossible)
- Industry standard for security

#### 2. **JWT Tokens (JSON Web Tokens)**
```python
def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,        # Subject (user ID)
        "email": email,
        "role": role,          # admin | student | parent | teacher
        "exp": datetime.now() + timedelta(hours=8),  # Expires in 8 hours
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now() + timedelta(days=7),  # Expires in 7 days
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
```

**How JWT Works:**
1. User logs in → Server creates JWT token
2. JWT stored in httpOnly cookie (secure, can't be accessed by JavaScript)
3. Every request includes JWT in Authorization header
4. Server verifies token signature without hitting database
5. When access token expires, refresh token gets a new one

#### 3. **Role-Based Access Control (RBAC)**
```python
def require_role(*roles):
    async def _dep(user=Depends(get_current_user)):
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return _dep

# Usage:
@router.get("/admin/dashboard")
async def admin_dashboard(user=Depends(require_role("admin"))):
    # Only admins can access this
    return {"data": "..."}
```

---

### Data Models (`models.py`)

**Pydantic Models** - Validates and documents API data

```python
class UserRegister(BaseModel):
    name: str
    email: EmailStr              # Auto-validates email format
    password: str = Field(min_length=6)
    role: Literal["student", "parent", "teacher"] = "parent"
    phone: Optional[str] = None

class AdmissionApplication(BaseModel):
    # Student Details
    student_name: str
    date_of_birth: str
    class_applying: str
    
    # Parent Details
    father_name: str
    mother_name: str
    parent_email: EmailStr
    parent_phone: str
    
    # Address
    address: str
    city: str
    state: str
    pincode: str
    
    # Additional Options
    transport_required: bool = False
    hostel_required: bool = False
    medical_conditions: Optional[str] = ""
```

**Why Pydantic?**
- Automatic validation (email, phone format, required fields)
- Type checking (prevents invalid data from reaching database)
- Auto-generates API documentation
- Performance (C-compiled validators)

---

### Email Service (`email_service.py`)

**Resend Email Integration**

```python
async def send_admission_confirmation(
    to_email: str,
    student_name: str,
    application_number: str,
    class_applying: str,
):
    """
    What it does:
    1. Formats beautiful HTML email
    2. Sends via Resend API
    3. Logs errors if something fails
    """
    resend.api_key = os.environ["RESEND_API_KEY"]
    
    html = f"""
    <div>
        <h1>Application Received</h1>
        <p>Student: {student_name}</p>
        <p>Application #: {application_number}</p>
        <p>Our team will review within 3-5 days</p>
    </div>
    """
    
    resend.Emails.send({
        "from": "The Foundation Academy <onboarding@resend.dev>",
        "to": [to_email],
        "subject": f"Admission Application Received — {application_number}",
        "html": html,
    })
```

**Why Resend?**
- High deliverability rate
- Works great with APIs
- No complex SMTP setup
- Real-time tracking

---

### API Routes

#### **Authentication Routes** (`routes/auth_routes.py`)

```python
@router.post("/api/auth/register")
# Takes: name, email, password, role
# Returns: User object + Sets JWT cookies
# What it does:
#  1. Validates email not already registered
#  2. Hashes password with Bcrypt
#  3. Inserts user into MongoDB
#  4. Creates JWT tokens (access + refresh)
#  5. Sets secure httpOnly cookies

@router.post("/api/auth/login")
# Takes: email, password
# Returns: User object + Sets JWT cookies
# What it does:
#  1. Finds user by email
#  2. Verifies password matches hash
#  3. Creates new JWT tokens
#  4. Returns user data

@router.get("/api/auth/me")
# Requires: Valid JWT token
# Returns: Current user details
# Checks role permission automatically

@router.post("/api/auth/refresh")
# Takes: Refresh token in cookie
# Returns: New access token
# What it does:
#  1. Validates refresh token
#  2. Finds associated user
#  3. Issues new 8-hour access token
```

---

#### **Admission Routes** (`routes/admission_routes.py`)

```python
@router.post("/api/admission/apply")
# Takes: Complete admission form data
# What it does:
#  1. Generates unique application number
#  2. Stores application in MongoDB
#  3. Sends confirmation email via Resend
#  4. Returns application number for tracking

@router.get("/api/admission/track/{application_number}")
# Takes: Application number
# Returns: Current status (pending, approved, rejected, etc.)

@router.get("/api/admission/list")  # Admin only
# Returns: All applications (paginated)
# Allows filtering by status
```

---

#### **Payment Routes** (`routes/payment_routes.py`)

**Stripe Payment Integration**

```python
@router.post("/api/payment/create-checkout")
# Takes: amount, description, email, student_name
# What it does:
#  1. Validates minimum payment (₹1 = 100 paise)
#  2. Creates Stripe checkout session
#  3. Stores payment record in MongoDB with "pending" status
#  4. Returns checkout URL for redirect

@router.get("/api/payment/status/{session_id}")
# Takes: Stripe session ID
# What it does:
#  1. Checks payment status in MongoDB
#  2. If still pending, queries Stripe API
#  3. If paid, updates status and sends confirmation email
#  4. Returns current payment status

@router.get("/api/payment/config")
# Returns: Stripe publishable key for frontend
```

**Payment Flow:**
```
User clicks "Pay" 
  ↓
Frontend creates checkout session via API
  ↓
User redirected to Stripe checkout page
  ↓
User enters card details (all Stripe side - we never see card data)
  ↓
Payment processed
  ↓
User redirected to success/cancel page
  ↓
Frontend polls /api/payment/status to confirm payment
  ↓
Backend verifies with Stripe, updates MongoDB, sends email
```

---

## 🎨 Frontend Architecture

### Routing Setup (`App.jsx`)

**React Router v7 - Client-side Navigation**

```javascript
const router = createBrowserRouter([
  // Public Routes (No login required)
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/admissions", element: <Admissions /> },
      { path: "/fees", element: <FeeStructure /> },
      // ... more public pages
    ]
  },

  // Login Page
  { path: "/login", element: <Login /> },

  // Protected Admin Routes
  {
    element: <ProtectedRoute allow={["admin"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/admin", element: <AdminOverview /> },
          { path: "/admin/admissions", element: <AdminAdmissions /> },
        ]
      }
    ]
  },

  // Protected Student/Parent/Teacher Routes (similar structure)
])
```

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

### Backend (Railway/Render)
```bash
git push heroku main
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

**Created by:** Ayush Uttam  
**GitHub:** https://github.com/ayushuttam6541-code  
**Project:** School Management System for The Foundation Academy

---

## 📞 Support

For issues, questions, or suggestions:
- Email: admin@foundationacademy.in
- Phone: +91-8986233963

---

**Happy coding! 🎓**
