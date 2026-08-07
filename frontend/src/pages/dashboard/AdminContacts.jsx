import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EnvelopeSimple, Phone, User } from "@phosphor-icons/react";
import { api, formatApiErrorDetail } from "@/lib/api";

export default function AdminContacts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/contacts/list")
      .then(({ data }) => setItems(data))
      .catch((err) => toast.error(formatApiErrorDetail(err.response?.data?.detail)))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/contacts/${id}/status`, { status: "read" });
      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status: "read" } : c)));
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  return (
    <div data-testid="admin-contacts">
      <h1 className="font-display text-3xl font-bold text-[#1E3A8A]">Contact Inquiries</h1>
      <p className="text-slate-500 mt-1 mb-6">Messages from the public contact form.</p>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin" /></div>
      ) : !items.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">No inquiries yet</div>
      ) : (
        <div className="space-y-4">
          {items.map((c) => (
            <article
              key={c.id}
              className={`rounded-2xl border bg-white p-5 ${c.status === "new" ? "border-amber-200 bg-amber-50/30" : "border-slate-200"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-[#1E3A8A]">
                    <User size={18} weight="duotone" /> {c.name}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><EnvelopeSimple size={14} /> {c.email}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {c.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{new Date(c.created_at).toLocaleString()}</div>
                  {c.status === "new" && (
                    <button
                      onClick={() => markRead(c.id)}
                      className="mt-1 text-xs font-semibold text-[#1E3A8A] hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              <h3 className="mt-3 font-medium text-slate-800">{c.subject}</h3>
              <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{c.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
