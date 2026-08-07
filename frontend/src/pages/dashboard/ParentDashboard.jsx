import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Bell, CreditCard, ChartLine } from "@phosphor-icons/react";
import { api } from "@/lib/api";

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/parent/overview")
      .then(({ data: d }) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div className="text-center py-20 text-slate-500">Failed to load dashboard.</div>;

  return (
    <div data-testid="parent-dashboard">
      <h1 className="font-display text-3xl font-bold text-[#1E3A8A]">Welcome, {data.user?.name}</h1>
      <p className="text-slate-500 mt-1 mb-8">Track your child's progress and school updates.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-[#1E3A8A] flex items-center gap-2">
            <Users size={22} weight="duotone" /> My Children
          </h2>
          {data.children?.map((child) => (
            <motion.div
              key={child.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-bold text-slate-900">{child.name}</div>
                  <div className="text-sm text-slate-500">Class {child.class}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-700 text-sm font-semibold">
                    <ChartLine size={16} /> {child.attendance}% attendance
                  </div>
                </div>
              </div>
              {child.fee_due > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <CreditCard size={18} />
                    <span className="text-sm font-medium">Fee due: ₹{child.fee_due.toLocaleString()}</span>
                  </div>
                  <Link to="/fees" className="text-xs font-bold text-[#1E3A8A] hover:underline">Pay now</Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1E3A8A] flex items-center gap-2 mb-4">
            <Bell size={22} weight="duotone" /> School Notices
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
            {data.notices?.map((n) => (
              <div key={n.title} className="px-5 py-4">
                <div className="font-medium text-slate-800">{n.title}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
          <Link to="/events" className="inline-block mt-4 text-sm font-semibold text-amber-600 hover:underline">
            View all events & notices →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
