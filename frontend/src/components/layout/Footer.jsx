import { Link } from "react-router-dom";
import { GraduationCap, Phone, EnvelopeSimple, MapPin, YoutubeLogo, FacebookLogo, InstagramLogo } from "@phosphor-icons/react";
import { SCHOOL } from "@/lib/api";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative mt-24 bg-[#0f1e5c] text-slate-200 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center">
              <GraduationCap size={26} weight="duotone" className="text-[#1E3A8A]" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl font-bold text-white">The Foundation</div>
              <div className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">Academy</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-300 leading-relaxed">
            {SCHOOL.tagline}. English medium, co-education, CBSE pattern — Nursery to Class VIII.
          </p>
          <div className="flex gap-3 mt-6">
            <a href={`https://youtube.com/@${SCHOOL.youtube}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500 flex items-center justify-center transition-colors" data-testid="footer-youtube">
              <YoutubeLogo size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500 flex items-center justify-center transition-colors">
              <FacebookLogo size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500 flex items-center justify-center transition-colors">
              <InstagramLogo size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-white mb-5">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {["About", "Facilities", "Faculty", "Gallery", "Events", "Fees"].map((l) => (
              <li key={l}><Link to={`/${l.toLowerCase()}`} className="hover:text-amber-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-white mb-5">Admissions</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/admissions" className="hover:text-amber-400">Apply Online</Link></li>
            <li><Link to="/admissions#process" className="hover:text-amber-400">Admission Process</Link></li>
            <li><Link to="/fees" className="hover:text-amber-400">Fee Structure</Link></li>
            <li><Link to="/track" className="hover:text-amber-400">Track Application</Link></li>
            <li><Link to="/contact" className="hover:text-amber-400">Enquire</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-white mb-5">Reach Us</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-3"><MapPin size={20} className="text-amber-400 shrink-0 mt-0.5" /><span>{SCHOOL.address}</span></li>
            <li className="flex gap-3"><Phone size={20} className="text-amber-400 shrink-0 mt-0.5" /><span>{SCHOOL.phones.join(", ")}</span></li>
            <li className="flex gap-3"><EnvelopeSimple size={20} className="text-amber-400 shrink-0 mt-0.5" /><span>{SCHOOL.email}</span></li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} The Foundation Academy. All rights reserved.</div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-amber-400">Privacy</Link>
            <Link to="/terms" className="hover:text-amber-400">Terms</Link>
            <Link to="/disclosure" className="hover:text-amber-400">Mandatory Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
