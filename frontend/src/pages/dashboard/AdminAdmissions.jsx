import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MagnifyingGlass, Funnel } from "@phosphor-icons/react";
import { api, formatApiErrorDetail } from "@/lib/api";

const STATUSES = ["all", "pending", "under_review", "approved", "rejected", "waitlisted"];

export default function AdminAdmissions() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await api.get("/admission/list", { params });
      setItems(data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const filtered = items.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.student_name?.toLowerCase().includes(q) ||
      a.application_number?.toLowerCase().includes(q) ||
      a.parent_email?.toLowerCase().includes(q)
    );
  });

  const updateStatus = async (status) => {
    if (!selected) return;
    setBusy(true);
    try {
      await api.patch(`/admission/${selected.id}/status`, { status, remarks });
      toast.success(`Application ${status.replace("_", " ")}`);
      setSelected(null);
      setRemarks("");
      load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="admin-admissions">
      <h1 className="font-display text-3xl font-bold text-[#1E3A8A]">Admission Applications</h1>
      <p className="text-slate-500 mt-1 mb-6">Review and manage all online admission submissions.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            data-testid="admission-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, number, email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1E3A8A] outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Funnel size={18} className="text-slate-400" />
          <select
            data-testid="admission-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s === "all" ? "All statuses" : s.replace("_", " ")}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">App #</th>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Class</th>
                  <th className="px-4 py-3 font-semibold">Parent</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs">{a.application_number}</td>
                    <td className="px-4 py-3 font-medium">{a.student_name}</td>
                    <td className="px-4 py-3">{a.class_applying}</td>
                    <td className="px-4 py-3">
                      <div>{a.parent_phone}</div>
                      <div className="text-xs text-slate-500">{a.parent_email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        data-testid={`review-${a.application_number}`}
                        onClick={() => { setSelected(a); setRemarks(a.remarks || ""); }}
                        className="text-[#1E3A8A] font-semibold hover:underline text-xs"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No applications found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold text-[#1E3A8A]">{selected.student_name}</h2>
            <p className="text-sm text-slate-500">{selected.application_number} · {selected.class_applying}</p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Detail label="DOB" value={selected.date_of_birth} />
              <Detail label="Gender" value={selected.gender} />
              <Detail label="Father" value={selected.father_name} />
              <Detail label="Mother" value={selected.mother_name} />
              <Detail label="Phone" value={selected.parent_phone} />
              <Detail label="Email" value={selected.parent_email} />
              <Detail label="Address" value={`${selected.address}, ${selected.city}`} />
              <Detail label="Transport" value={selected.transport_required ? "Yes" : "No"} />
              <Detail label="Hostel" value={selected.hostel_required ? "Yes" : "No"} />
            </dl>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-600 uppercase">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["under_review", "approved", "waitlisted", "rejected"].map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => updateStatus(s)}
                  className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    under_review: "bg-blue-100 text-blue-800",
    waitlisted: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${colors[status] || "bg-slate-100"}`}>
      {status?.replace("_", " ")}
    </span>
  );
}
