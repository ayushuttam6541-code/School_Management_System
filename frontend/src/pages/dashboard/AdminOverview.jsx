import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, EnvelopeSimple, CheckCircle, Clock, ChartBar,
} from "@phosphor-icons/react";
import { api } from "@/lib/api";

const STAT_CARDS = [
  { key: "admissions_total", label: "Total Applications", icon: Users, color: "bg-blue-50 text-[#1E3A8A]" },
  { key: "admissions_pending", label: "Pending Review", icon: Clock, color: "bg-amber-50 text-amber-700" },
  { key: "admissions_approved", label: "Approved", icon: CheckCircle, color: "bg-green-50 text-green-700" },
  { key: "contacts_total", label: "Inquiries", icon: EnvelopeSimple, color: "bg-purple-50 text-purple-700" },
];

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/admin/overview")
      .then(({ data: d }) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <ErrorState />;

  const { stats, recent_admissions, recent_contacts } = data;

  return (
    <div data-testid="admin-overview">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#1E3A8A]">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of admissions, inquiries, and school activity.</p>
        </div>
        <Link to="/admin/admissions" className="px-5 py-2.5 rounded-full bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#0f1e5c]">
          Manage Admissions
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} weight="duotone" />
            </div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{stats[key] ?? 0}</div>
            <div className="text-sm text-slate-500 mt-1">{label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Section title="Recent Applications" link="/admin/admissions">
          {recent_admissions?.length ? recent_admissions.map((a) => (
            <Row
              key={a.id}
              title={a.student_name}
              sub={`${a.class_applying} · ${a.application_number}`}
              badge={a.status}
            />
          )) : <Empty text="No applications yet" />}
        </Section>

        <Section title="Recent Inquiries" link="/admin/contacts">
          {recent_contacts?.length ? recent_contacts.map((c) => (
            <Row key={c.id} title={c.name} sub={c.subject} badge={c.status || "new"} />
          )) : <Empty text="No inquiries yet" />}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, link, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="font-display text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
          <ChartBar size={20} weight="duotone" /> {title}
        </h2>
        <Link to={link} className="text-xs font-semibold text-amber-600 hover:underline">View all</Link>
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function Row({ title, sub, badge }) {
  const colors = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    under_review: "bg-blue-100 text-blue-800",
    waitlisted: "bg-purple-100 text-purple-800",
    new: "bg-slate-100 text-slate-700",
  };
  return (
    <div className="px-5 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="font-medium text-slate-800 truncate">{title}</div>
        <div className="text-xs text-slate-500 truncate">{sub}</div>
      </div>
      <span className={`shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded-full ${colors[badge] || colors.new}`}>
        {badge?.replace("_", " ")}
      </span>
    </div>
  );
}

function Empty({ text }) {
  return <div className="px-5 py-8 text-center text-sm text-slate-400">{text}</div>;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="text-center py-20 text-slate-500">
      Failed to load dashboard. Please refresh.
    </div>
  );
}
