import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { List, X, GraduationCap, CaretDown } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { SCHOOL } from "@/lib/api";

const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Facilities", to: "/facilities" },
  { label: "Faculty", to: "/faculty" },
  { label: "Gallery", to: "/gallery" },
  { label: "Events", to: "/events" },
  { label: "Fees", to: "/fees" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const loc = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const dashHref =
    user && user.role === "admin" ? "/admin"
    : user && user.role === "student" ? "/student"
    : user && user.role === "parent" ? "/parent"
    : user && user.role === "teacher" ? "/teacher"
    : "/login";

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-40 transition-[background,box-shadow,padding] duration-300 ${
        scrolled ? "glass py-2" : "bg-white/40 backdrop-blur-md py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center gap-6">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] flex items-center justify-center shadow-lg shadow-blue-900/20">
            <GraduationCap size={24} weight="duotone" className="text-amber-400" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold text-[#1E3A8A]">The Foundation</div>
            <div className="text-[10px] uppercase tracking-widest text-amber-600 font-semibold">Academy</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1E3A8A] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 ml-auto">
          <Link
            to="/admissions"
            data-testid="nav-apply-btn"
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-amber-500 text-[#1E3A8A] hover:bg-amber-400 shadow-lg shadow-amber-500/25 transition-colors"
          >
            Apply Now
          </Link>
          {user ? (
            <>
              <Link
                to={dashHref}
                data-testid="nav-dashboard-btn"
                className="px-4 py-2.5 rounded-full text-sm font-semibold border border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                data-testid="nav-logout-btn"
                className="text-sm text-slate-600 hover:text-slate-900 px-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              data-testid="nav-login-btn"
              className="px-4 py-2.5 rounded-full text-sm font-semibold border border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        <button
          className="lg:hidden ml-auto p-2 rounded-full hover:bg-slate-100"
          onClick={() => setOpen((o) => !o)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass mt-2 mx-4 rounded-2xl p-3">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={`nav-mobile-${n.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive ? "bg-[#1E3A8A] text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/admissions" className="flex-1 text-center px-4 py-3 rounded-full text-sm font-semibold bg-amber-500 text-[#1E3A8A]">Apply Now</Link>
              {user ? (
                <Link to={dashHref} className="flex-1 text-center px-4 py-3 rounded-full text-sm font-semibold border border-[#1E3A8A] text-[#1E3A8A]">Dashboard</Link>
              ) : (
                <Link to="/login" className="flex-1 text-center px-4 py-3 rounded-full text-sm font-semibold border border-[#1E3A8A] text-[#1E3A8A]">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
