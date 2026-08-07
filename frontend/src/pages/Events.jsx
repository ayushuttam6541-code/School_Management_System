import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { CalendarBlank, Newspaper, Megaphone } from "@phosphor-icons/react";

const ICON = { event: CalendarBlank, news: Newspaper, notice: Megaphone };
const TONE = { event: "bg-amber-50 text-amber-700 border-amber-200", news: "bg-blue-50 text-blue-700 border-blue-200", notice: "bg-slate-100 text-slate-700 border-slate-200" };

export default function Events() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/notices").then(r => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="events-page">
      <section className="relative py-24 bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Events & Notices</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-3 leading-tight">What's happening at <span className="italic gradient-text-gold">The Foundation</span></h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 space-y-4">
          {items.length === 0 && <div className="text-slate-500">No events posted yet.</div>}
          {items.map((n, i) => {
            const Icon = ICON[n.category] || Megaphone;
            return (
              <motion.div key={n.id} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="rounded-3xl border border-slate-200 p-6 flex gap-5 hover:bg-slate-50 transition-colors" data-testid={`event-${i}`}>
                <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A] text-amber-400 flex items-center justify-center shrink-0"><Icon size={24} weight="duotone"/></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-xl font-bold text-[#1E3A8A]">{n.title}</h3>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-full border ${TONE[n.category]||TONE.notice}`}>{n.category}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{n.body}</p>
                  {n.event_date && <div className="text-xs text-slate-500 mt-3">📅 {n.event_date}</div>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
