import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { House, ChartBar, Users, Books, Bell, SignOut, GraduationCap } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

const NAVS = {
  admin: [
    { to: "/admin", label: "Overview", icon: ChartBar },
    { to: "/admin/admissions", label: "Admissions", icon: Users },
    { to: "/admin/contacts", label: "Inquiries", icon: Bell },
  ],
  student: [
    { to: "/student", label: "My Learning", icon: Books },
  ],
  parent: [
    { to: "/parent", label: "My Child", icon: Users },
  ],
  teacher: [
    { to: "/teacher", label: "My Classes", icon: Books },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const items = user ? (NAVS[user.role] || []) : [];

  const handleLogout = async () => {
    await logout();
    nav("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:flex flex-col bg-white border-r border-slate-200 p-5">
        <Link to="/" className="flex items-center gap-3 mb-8" data-testid="dash-logo">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] flex items-center justify-center">
            <GraduationCap size={22} weight="duotone" className="text-amber-400" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-[#1E3A8A]">Foundation</div>
            <div className="text-[10px] uppercase tracking-widest text-amber-600">Academy</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end
              data-testid={`dash-nav-${it.label.toLowerCase().replace(/\s/g,'-')}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-[#1E3A8A] text-white" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <it.icon size={18} weight="duotone" />
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200">
          <div className="text-xs text-slate-500 mb-2">Signed in as</div>
          <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
          <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
          <button
            data-testid="dash-logout"
            onClick={handleLogout}
            className="mt-4 w-full flex items-center gap-2 justify-center px-3 py-2 rounded-lg text-sm border border-slate-200 hover:bg-slate-100 text-slate-700"
          >
            <SignOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div>
        <header className="lg:hidden bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
              <GraduationCap size={18} className="text-amber-400" />
            </div>
            <span className="font-display font-bold text-[#1E3A8A]">TFA</span>
          </Link>
          <button onClick={handleLogout} className="text-sm text-slate-600">Sign out</button>
        </header>
        <main className="p-6 lg:p-10 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
