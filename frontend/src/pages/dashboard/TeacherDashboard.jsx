import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Books, Calendar, ClipboardText, Users } from "@phosphor-icons/react";
import { api } from "@/lib/api";

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/teacher/overview")
      .then(({ data: d }) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div className="text-center py-20 text-slate-500">Failed to load dashboard.</div>;

  const totalStudents = data.classes?.reduce((sum, c) => sum + c.students, 0) || 0;

  return (
    <div data-testid="teacher-dashboard">
      <h1 className="font-display text-3xl font-bold text-[#1E3A8A]">Welcome, {data.user?.name}</h1>
      <p className="text-slate-500 mt-1 mb-8">Your teaching dashboard at The Foundation Academy.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={Books} label="Classes" value={data.classes?.length || 0} color="bg-blue-50 text-[#1E3A8A]" />
        <StatCard icon={Users} label="Total Students" value={totalStudents} color="bg-green-50 text-green-700" />
        <StatCard icon={ClipboardText} label="Pending Grading" value={data.pending_grading || 0} color="bg-amber-50 text-amber-700" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Panel title="My Classes" icon={Books}>
          {data.classes?.map((c) => (
            <div key={c.class} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <div className="font-medium text-slate-800">Class {c.class}</div>
                <div className="text-sm text-slate-500">{c.subject}</div>
              </div>
              <span className="text-sm font-semibold text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-full">
                {c.students} students
              </span>
            </div>
          ))}
        </Panel>

        <Panel title="Today's Schedule" icon={Calendar}>
          {data.todays_schedule?.map((s) => (
            <div key={`${s.time}-${s.class}`} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
              <div className="text-sm font-mono font-bold text-amber-600 w-14">{s.time}</div>
              <div>
                <div className="font-medium text-slate-800">Class {s.class}</div>
                <div className="text-sm text-slate-500">{s.subject}</div>
              </div>
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

function Panel({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
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
