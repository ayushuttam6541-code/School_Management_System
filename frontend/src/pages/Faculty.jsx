import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { EnvelopeSimple, ChalkboardTeacher } from "@phosphor-icons/react";

export default function Faculty() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/faculty").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  const initials = (n) => n.split(" ").map(s => s[0]).slice(0,2).join("");

  return (
    <div data-testid="faculty-page">
      <section className="relative py-24 bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Our Team</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-3 leading-tight">The teachers who <span className="italic gradient-text-gold">shape the future</span></h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p, i) => (
            <motion.div key={p.name} initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-8 hover:-translate-y-1 hover:shadow-xl transition-transform">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-amber-400 flex items-center justify-center font-display text-2xl font-bold">{initials(p.name)}</div>
              <h3 className="font-display text-xl font-bold text-[#1E3A8A] mt-5">{p.name}</h3>
              <div className="text-sm text-amber-600 font-semibold uppercase tracking-wider mt-1">{p.role}</div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500"><ChalkboardTeacher size={14}/> {p.subject}</div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{p.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
