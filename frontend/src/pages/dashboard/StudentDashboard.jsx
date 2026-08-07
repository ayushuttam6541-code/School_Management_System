import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Books, Calendar, ChartLine, ClipboardText } from "@phosphor-icons/react";
import { api } from "@/lib/api";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/student/overview")
      .then(({ data: d }) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div className="text-center py-20 text-slate-500">Failed to load dashboard.</div>;

  return (
    <div data-testid="student-dashboard">
      <h1 className="font-display text-3xl font-bold text-[#1E3A8A]">Welcome, {data.user?.name}</h1>
      <p className="text-slate-500 mt-1 mb-8">Your learning dashboard at The Foundation Academy.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={ChartLine} label="Attendance" value={`${data.attendance_pct}%`} color="bg-green-50 text-green-700" />
        <StatCard icon={Calendar} label="Upcoming Exams" value={data.upcoming_exams?.length || 0} color="bg-blue-50 text-[#1E3A8A]" />
        <StatCard icon={Books} label="Subjects" value={data.recent_marks?.length || 0} color="bg-amber-50 text-amber-700" />
        <StatCard icon={ClipboardText} label="Homework" value={data.homework?.length || 0} color="bg-purple-50 text-purple-700" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Panel title="Recent Marks" icon={ChartLine}>
          {data.recent_marks?.map((m) => (
            <div key={m.subject} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-800">{m.subject}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1E3A8A] rounded-full" style={{ width: `${(m.score / m.max) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-[#1E3A8A]">{m.score}/{m.max}</span>
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Upcoming Exams" icon={Calendar}>
          {data.upcoming_exams?.map((e) => (
            <div key={e.subject} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-800">{e.subject}</span>
              <span className="text-sm text-slate-500">{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            </div>
          ))}
        </Panel>

        <Panel title="Homework" icon={ClipboardText} className="lg:col-span-2">
          {data.homework?.map((h) => (
            <div key={h.subject} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#1E3A8A]">{h.subject}</span>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Due {h.due}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{h.task}</p>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} weight="duotone" />
      </div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </motion.div>
  );
}

function Panel({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Icon size={20} weight="duotone" className="text-[#1E3A8A]" />
        <h2 className="font-display text-lg font-bold text-[#1E3A8A]">{title}</h2>
      </div>
      <div className="px-5 py-2">{children}</div>
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
