import { useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { MagnifyingGlass, Clock, CheckCircle, XCircle } from "@phosphor-icons/react";

const STATUS_MAP = {
  pending: { label: "Pending Review", tone: "bg-slate-100 text-slate-700", icon: Clock },
  under_review: { label: "Under Review", tone: "bg-blue-100 text-blue-700", icon: Clock },
  approved: { label: "Approved", tone: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", tone: "bg-red-100 text-red-700", icon: XCircle },
  waitlisted: { label: "Waitlisted", tone: "bg-amber-100 text-amber-800", icon: Clock },
};

export default function TrackAdmission() {
  const [num, setNum] = useState("");
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!num.trim()) return;
    setBusy(true);
    try {
      const { data } = await api.get(`/admission/track/${num.trim()}`);
      setData(data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Not found");
      setData(null);
    } finally { setBusy(false); }
  };

  const S = data ? STATUS_MAP[data.status] || STATUS_MAP.pending : null;

  return (
    <div data-testid="track-page" className="bg-slate-50 min-h-[70vh]">
      <Toaster position="top-center" richColors />
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-xs uppercase tracking-widest text-amber-600 font-bold">Track Application</div>
          <h1 className="font-display text-4xl font-bold text-[#1E3A8A] mt-3">Where's my application?</h1>
          <form onSubmit={search} className="mt-8 flex gap-3">
            <input data-testid="track-input" value={num} onChange={(e)=>setNum(e.target.value)} placeholder="TFA-2026-00001" className="flex-1 px-5 py-3 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
            <button data-testid="track-btn" disabled={busy} className="px-6 py-3 rounded-full bg-[#1E3A8A] hover:bg-[#0f1e5c] text-white font-semibold flex items-center gap-2 disabled:opacity-60"><MagnifyingGlass size={18} weight="bold"/>{busy?"Searching…":"Track"}</button>
          </form>

          {data && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-8 rounded-3xl bg-white border border-slate-200 p-8" data-testid="track-result">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs uppercase text-slate-500 tracking-wider">Application</div>
                  <div className="font-display text-xl font-bold text-[#1E3A8A]">{data.application_number}</div>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${S.tone}`}>
                  <S.icon size={16} weight="fill" /> {S.label}
                </div>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
                <Row k="Student" v={data.student_name} />
                <Row k="Class" v={data.class_applying} />
                <Row k="Parent Email" v={data.parent_email} />
                <Row k="Parent Phone" v={data.parent_phone} />
                {data.remarks && <Row k="Remarks" v={data.remarks} />}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

const Row = ({ k, v }) => (
  <div className="rounded-2xl bg-slate-50 p-3">
    <div className="text-xs uppercase text-slate-500 font-semibold">{k}</div>
    <div className="text-[#1E3A8A] mt-0.5">{v}</div>
  </div>
);
