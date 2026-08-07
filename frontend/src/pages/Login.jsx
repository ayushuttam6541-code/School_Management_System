import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { GraduationCap } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/api";

const DEST = { admin: "/admin", student: "/student", parent: "/parent", teacher: "/teacher" };

export default function Login() {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "parent", phone: "" });
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = mode === "login"
        ? await login(form.email, form.password)
        : await register(form);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      const dest = loc.state?.from?.pathname || DEST[user.role] || "/";
      nav(dest, { replace: true });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" data-testid="login-page">
      <div className="relative hidden lg:flex bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] p-12 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center"><GraduationCap size={22} weight="duotone" className="text-[#1E3A8A]" /></div>
            <div className="leading-tight"><div className="font-display text-lg font-bold">The Foundation</div><div className="text-[10px] uppercase tracking-widest text-amber-300">Academy</div></div>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">Welcome to your <span className="italic gradient-text-gold">Foundation</span> portal</h2>
            <p className="mt-4 text-blue-100">Access your dashboard — admissions, results, fees, homework, and more.</p>
          </div>
          <div className="text-xs text-blue-200">© {new Date().getFullYear()} The Foundation Academy</div>
        </div>
      </div>

      <div className="flex items-center p-6 sm:p-12 bg-slate-50">
        <motion.form initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} onSubmit={submit} className="w-full max-w-md mx-auto">
          <div className="flex gap-2 mb-8 bg-white rounded-full p-1 border border-slate-200 w-fit">
            <button type="button" onClick={()=>setMode("login")} data-testid="tab-login" className={`px-5 py-2 rounded-full text-sm font-semibold ${mode==="login"?"bg-[#1E3A8A] text-white":"text-slate-600"}`}>Login</button>
            <button type="button" onClick={()=>setMode("register")} data-testid="tab-register" className={`px-5 py-2 rounded-full text-sm font-semibold ${mode==="register"?"bg-[#1E3A8A] text-white":"text-slate-600"}`}>Register</button>
          </div>

          <h1 className="font-display text-3xl font-bold text-[#1E3A8A]">{mode==="login"?"Sign in":"Create account"}</h1>
          <p className="text-sm text-slate-500 mt-2">Parent, student, teacher and admin logins.</p>

          <div className="mt-6 space-y-4">
            {mode === "register" && (
              <>
                <Field label="Full Name" testId="reg-name" value={form.name} onChange={change("name")} required />
                <Field label="Phone" testId="reg-phone" value={form.phone} onChange={change("phone")} />
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">I am a</label>
                  <select data-testid="reg-role" value={form.role} onChange={change("role")} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-[#1E3A8A]">
                    <option value="parent">Parent</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </>
            )}
            <Field label="Email" testId="login-email" type="email" value={form.email} onChange={change("email")} required />
            <Field label="Password" testId="login-password" type="password" value={form.password} onChange={change("password")} required />
          </div>

          <button data-testid="login-submit" disabled={busy} className="mt-6 w-full py-3 rounded-full bg-[#1E3A8A] hover:bg-[#0f1e5c] text-white font-semibold disabled:opacity-60">{busy?"Please wait…":(mode==="login"?"Sign in":"Create account")}</button>

          {mode === "login" && (
            <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-xs text-slate-700">
              <div className="font-semibold text-[#1E3A8A] mb-2">Demo credentials</div>
              <div>Admin: admin@foundationacademy.in / Admin@123</div>
              <div>Parent: parent@foundationacademy.in / Parent@123</div>
              <div>Student: student@foundationacademy.in / Student@123</div>
              <div>Teacher: teacher@foundationacademy.in / Teacher@123</div>
            </div>
          )}
        </motion.form>
      </div>
    </div>
  );
}

function Field({ label, testId, ...rest }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
      <input {...rest} data-testid={testId} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
    </div>
  );
}
