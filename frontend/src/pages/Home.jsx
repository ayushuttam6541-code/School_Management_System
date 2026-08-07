import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MarqueeModule from "react-fast-marquee";
const Marquee = MarqueeModule.default || MarqueeModule;
import {
  GraduationCap, Sparkle, Trophy, Users, BookOpen, Buildings,
  Basketball, Palette, Bus, House as HouseIcon, Desktop, PersonSimpleTaiChi,
  Star, ArrowRight, ChalkboardTeacher, MicrophoneStage, Atom, Quotes,
} from "@phosphor-icons/react";
import { SCHOOL } from "@/lib/api";

const HERO_IMG = "https://images.unsplash.com/photo-1785190095920-302ea67de2e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxpbnRlcm5hdGlvbmFsJTIwc2Nob29sJTIwY2FtcHVzJTIwc3R1ZGVudHN8ZW58MHx8fHwxNzg1ODE1MzUxfDA&ixlib=rb-4.1.0&q=85";
const LAB_IMG = "https://images.unsplash.com/photo-1778489769184-45868633c527?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxzdHVkZW50cyUyMGxlYXJuaW5nJTIwY29tcHV0ZXIlMjBsYWJ8ZW58MHx8fHwxNzg1ODE1MzUxfDA&ixlib=rb-4.1.0&q=85";
const SPORTS_IMG = "https://images.unsplash.com/photo-1745012010615-47abbeb3e906?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxzY2hvb2wlMjBjaGlsZHJlbiUyMHNwb3J0cyUyMHBsYXlpbmd8ZW58MHx8fHwxNzg1ODE1MzUxfDA&ixlib=rb-4.1.0&q=85";
const CAMPUS_IMG = "https://images.unsplash.com/photo-1785190095869-0e76c869c0d1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwzfHxpbnRlcm5hdGlvbmFsJTIwc2Nob29sJTIwY2FtcHVzJTIwc3R1ZGVudHN8ZW58MHx8fHwxNzg1ODE1MzUxfDA&ixlib=rb-4.1.0&q=85";

const facilities = [
  { icon: Desktop, title: "Smart Classrooms", desc: "Digital boards, projectors, and interactive lessons in every classroom.", tone: "blue" },
  { icon: Atom, title: "NEET & JEE Foundation", desc: "Early competitive exam preparation for classes VI–VIII.", tone: "gold" },
  { icon: Trophy, title: "Olympiad & KVPY", desc: "Structured coaching for national talent search programs.", tone: "blue" },
  { icon: Basketball, title: "Sports & Games", desc: "Indoor and outdoor sports, coached by trained professionals.", tone: "gold" },
  { icon: Palette, title: "Arts, Dance, Yoga", desc: "Holistic development beyond the classroom.", tone: "blue" },
  { icon: Bus, title: "Transport", desc: "Safe, GPS-tracked transport across Harnaut and nearby villages.", tone: "gold" },
  { icon: HouseIcon, title: "Hostel Facility", desc: "Well-supervised residential facility with home-like care.", tone: "blue" },
  { icon: MicrophoneStage, title: "English Speaking", desc: "Daily practice sessions and personality development.", tone: "gold" },
];

const stats = [
  { n: "850+", l: "Students", icon: Users },
  { n: "45+",  l: "Educators", icon: ChalkboardTeacher },
  { n: "12+",  l: "Years of Excellence", icon: Trophy },
  { n: "98%",  l: "Success Rate", icon: Sparkle },
];

const leaders = [
  { name: "Er. Khushboo Kumari", role: "Principal", msg: "Every child is a spark. Our job is to give them the space, the discipline, and the love to shine — academically and as human beings." },
  { name: "Kaushal Kumar", role: "Director", msg: "The Foundation Academy was built on a simple belief: rural Bihar deserves the same quality of English-medium, CBSE-aligned education as any metro city." },
  { name: "Raj Kumar", role: "Management Director", msg: "We measure success not just by marks, but by the confidence and character we build in our students, one year at a time." },
];

const testimonials = [
  { name: "Reena Devi", role: "Parent, Class V", quote: "My daughter went from being shy to leading her class assembly in just one year. The teachers here really care." },
  { name: "Ankit Kumar", role: "Alumnus", quote: "The strong foundation I received here got me into a top science school. Grateful forever." },
  { name: "Sunita Sharma", role: "Parent, Class III", quote: "Smart classes, weekly assessments, and personal attention — worth every rupee." },
];

const process = [
  { step: "01", title: "Enquire", desc: "Fill the online admission form or call our office." },
  { step: "02", title: "Interact", desc: "A gentle interaction with the child and parents." },
  { step: "03", title: "Confirm", desc: "Document verification and fee payment." },
  { step: "04", title: "Welcome", desc: "Orientation and joining the Foundation family." },
];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.6 } };

export default function Home() {
  return (
    <div data-testid="home-page" className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/70 to-blue-900/20" />
        </div>
        <div className="absolute top-40 -right-24 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl blob" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl blob" style={{animationDelay:'-6s'}} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-8 items-center py-24">
          <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.8}} className="lg:col-span-8 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-widest text-amber-300 font-semibold">
              <Sparkle size={14} weight="fill" /> Admissions Open 2026-27
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mt-6 tracking-tight">
              Building <span className="gradient-text-gold italic">Future</span><br />
              On A Strong <span className="underline decoration-amber-500 decoration-[3px] underline-offset-8">Foundation</span>
            </h1>
            <p className="mt-6 text-lg text-blue-100 max-w-2xl leading-relaxed">
              English medium, co-education, CBSE pattern — from Nursery to Class VIII.
              Nurturing curious minds in the heart of Harnaut, Nalanda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/admissions" data-testid="hero-apply-btn" className="px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#1E3A8A] font-semibold shadow-2xl shadow-amber-500/40 flex items-center gap-2">
                Apply Online <ArrowRight size={18} weight="bold" />
              </Link>
              <Link to="/about" data-testid="hero-about-btn" className="px-7 py-3.5 rounded-full border-2 border-white/40 hover:bg-white hover:text-[#1E3A8A] text-white font-semibold backdrop-blur-md">
                Discover The School
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {stats.map((s) => (
                <div key={s.l} className="glass-dark rounded-2xl p-4">
                  <s.icon size={22} weight="duotone" className="text-amber-400" />
                  <div className="font-display text-3xl font-bold text-white mt-2">{s.n}</div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{delay:0.3, duration:0.8}} className="hidden lg:block lg:col-span-4">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/40 to-transparent blur-2xl" />
              <div className="relative glass rounded-3xl p-6 floaty">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center">
                    <GraduationCap size={26} weight="duotone" className="text-[#1E3A8A]" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Est. 2013</div>
                    <div className="font-display text-lg font-bold text-[#1E3A8A]">The Foundation Academy</div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <div className="text-xs text-blue-700 font-semibold">Classes</div>
                    <div className="text-sm text-[#1E3A8A] font-bold mt-0.5">Nursery – VIII</div>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3">
                    <div className="text-xs text-amber-700 font-semibold">Medium</div>
                    <div className="text-sm text-[#1E3A8A] font-bold mt-0.5">English</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-600 leading-relaxed">
                  Chandi Road, Harnaut, Nalanda, Bihar — 803110
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE RIBBON */}
      <div className="marquee-ribbon border-y border-amber-200/60 py-5">
        <Marquee gradient={false} speed={40}>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-8 font-display text-2xl">
              <Star size={18} weight="fill" className="text-amber-500" />
              <span className="italic text-[#1E3A8A]">Building Future On A Strong Foundation</span>
              <Star size={18} weight="fill" className="text-amber-500" />
              <span className="text-[#1E3A8A]">Admissions Open 2026-27</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* FACILITIES BENTO */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-amber-600 font-bold">Our Facilities</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1E3A8A] mt-3 leading-tight">
              A campus designed for <span className="italic">curious minds</span>
            </h2>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              Twenty world-class facilities — from smart digital classrooms to sports arenas — everything young learners need to thrive.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {facilities.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{opacity:0, y:24}}
                whileInView={{opacity:1, y:0}}
                viewport={{once:true, margin:"-60px"}}
                transition={{duration:0.5, delay:i*0.05}}
                className={`group rounded-3xl p-6 border transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 ${
                  f.tone === "gold"
                    ? "bg-amber-50 border-amber-100"
                    : "bg-blue-50/50 border-blue-100"
                }`}
                data-testid={`facility-${i}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  f.tone === "gold" ? "bg-amber-500 text-[#1E3A8A]" : "bg-[#1E3A8A] text-amber-400"
                }`}>
                  <f.icon size={24} weight="duotone" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1E3A8A] mt-5">{f.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE SPLIT — WHY US */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div {...fadeUp} className="lg:col-span-5 order-2 lg:order-1">
            <div className="text-xs uppercase tracking-widest text-amber-600 font-bold">Why Foundation</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1E3A8A] mt-3 leading-tight">
              More than lessons.<br />A <span className="italic">way of learning.</span>
            </h2>
            <div className="mt-8 space-y-5">
              {[
                { t: "Personalised Attention", d: "Small class sizes and dedicated extra classes for weak students." },
                { t: "Beyond CBSE", d: "Olympiad, KVPY, NEET/JEE foundation and personality development woven into weekly schedules." },
                { t: "A Safe, Nurturing Space", d: "Trained counsellors, women staff, and CCTV-monitored campus." },
              ].map((it, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-amber-400 flex items-center justify-center shrink-0 font-display font-bold">{i+1}</div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-[#1E3A8A]">{it.t}</h4>
                    <p className="text-sm text-slate-600 mt-1">{it.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="lg:col-span-7 order-1 lg:order-2 grid grid-cols-2 gap-4">
            <img src={LAB_IMG} alt="Computer Lab" className="rounded-3xl object-cover w-full h-72 shadow-xl shadow-blue-900/10" />
            <img src={SPORTS_IMG} alt="Sports" className="rounded-3xl object-cover w-full h-72 mt-8 shadow-xl shadow-blue-900/10" />
            <img src={CAMPUS_IMG} alt="Campus" className="rounded-3xl object-cover w-full h-56 col-span-2 shadow-xl shadow-blue-900/10" />
          </motion.div>
        </div>
      </section>

      {/* LEADERSHIP MESSAGES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-amber-600 font-bold">Voices Of Leadership</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1E3A8A] mt-3 leading-tight">
              From those who shape the school
            </h2>
          </motion.div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {leaders.map((l, i) => (
              <motion.div key={l.name} {...fadeUp} transition={{duration:0.6, delay:i*0.1}} className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-8">
                <Quotes size={32} weight="fill" className="text-amber-500" />
                <p className="mt-4 text-slate-700 leading-relaxed italic">"{l.msg}"</p>
                <div className="mt-6 pt-5 border-t border-blue-100">
                  <div className="font-display text-lg font-bold text-[#1E3A8A]">{l.name}</div>
                  <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider mt-0.5">{l.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ADMISSION PROCESS */}
      <section className="py-24 bg-[#0f1e5c] text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Admission Process</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 leading-tight">
              Four steps to join <span className="italic gradient-text-gold">The Foundation</span>
            </h2>
          </motion.div>

          <div className="mt-14 grid md:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <motion.div key={p.step} {...fadeUp} transition={{duration:0.5, delay:i*0.1}} className="relative">
                <div className="text-7xl font-display font-bold gradient-text-gold leading-none">{p.step}</div>
                <h3 className="font-display text-xl font-bold text-white mt-3">{p.title}</h3>
                <p className="text-sm text-blue-200 mt-2">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-14">
            <Link to="/admissions" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#1E3A8A] font-semibold shadow-2xl shadow-amber-500/30">
              Start Application <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-amber-600 font-bold">In Their Own Words</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1E3A8A] mt-3 leading-tight">Parents & students speak</h2>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{duration:0.5, delay:i*0.1}} className="rounded-3xl bg-white border border-slate-200 p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 transition-transform">
                <div className="flex gap-1">
                  {Array(5).fill(0).map((_, j) => <Star key={j} size={16} weight="fill" className="text-amber-500" />)}
                </div>
                <p className="mt-4 text-slate-700 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6">
                  <div className="font-semibold text-[#1E3A8A]">{t.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] p-10 lg:p-16">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Ready to build your child's<br />
                  <span className="gradient-text-gold italic">strong foundation?</span>
                </h2>
                <p className="mt-5 text-blue-100 text-lg max-w-xl">Admissions for the 2026-27 session are now open. Limited seats per class.</p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link to="/admissions" className="px-7 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-[#1E3A8A] font-semibold text-center shadow-2xl shadow-amber-500/30">Apply Online</Link>
                <a href={`tel:${SCHOOL.phones[0].replace(/\s/g, "")}`} className="px-7 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-center hover:bg-white hover:text-[#1E3A8A]">Call {SCHOOL.phones[0]}</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
