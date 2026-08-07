import { motion } from "framer-motion";
import {
  Desktop, Atom, Trophy, Basketball, Palette, Bus, House, MicrophoneStage,
  BookOpen, PersonSimpleTaiChi, ChalkboardTeacher, MusicNote, Calculator, Books, Users, ShieldCheck,
} from "@phosphor-icons/react";

const items = [
  { icon: Desktop, title: "Smart Digital Classrooms", desc: "Interactive boards and projectors in every room." },
  { icon: BookOpen, title: "Creative Education", desc: "Concept-first teaching with hands-on activities." },
  { icon: Calculator, title: "Computer Lab", desc: "Modern lab for coding and IT literacy." },
  { icon: ChalkboardTeacher, title: "Online Exams", desc: "Digital assessments with instant feedback." },
  { icon: Books, title: "Monthly Assessment", desc: "Regular tests to track student progress." },
  { icon: Users, title: "Extra Classes", desc: "Focused sessions for students who need support." },
  { icon: MicrophoneStage, title: "English Speaking", desc: "Daily spoken English & personality classes." },
  { icon: Atom, title: "NEET Foundation", desc: "Early medical entrance prep." },
  { icon: Atom, title: "JEE Foundation", desc: "Engineering entrance prep from Class VI." },
  { icon: Trophy, title: "Olympiad", desc: "Coaching for maths, science, English Olympiads." },
  { icon: Trophy, title: "KVPY Foundation", desc: "Support for the national science talent program." },
  { icon: Basketball, title: "Indoor Games", desc: "Chess, carrom, TT and more." },
  { icon: Basketball, title: "Outdoor Games", desc: "Cricket, football, athletics, kabaddi." },
  { icon: Palette, title: "Arts", desc: "Drawing, painting and craft studios." },
  { icon: MusicNote, title: "Dance", desc: "Trained instructors, annual showcase." },
  { icon: PersonSimpleTaiChi, title: "Yoga", desc: "Weekly yoga to build focus and calm." },
  { icon: House, title: "Hostel", desc: "Safe, well-supervised residential facility." },
  { icon: Bus, title: "Transport", desc: "Safe school buses across Harnaut & nearby areas." },
  { icon: ShieldCheck, title: "CCTV Security", desc: "Round-the-clock campus safety." },
];

export default function Facilities() {
  return (
    <div data-testid="facilities-page">
      <section className="relative py-24 bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Facilities</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-3 leading-tight max-w-3xl">Every facility a modern <span className="italic gradient-text-gold">learner</span> deserves</h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f, i) => (
            <motion.div key={i} initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.03}} className="rounded-3xl bg-slate-50 hover:bg-blue-50 border border-slate-200 p-6 transition-colors hover:-translate-y-1 hover:shadow-lg" data-testid={`facility-item-${i}`}>
              <div className="w-11 h-11 rounded-2xl bg-[#1E3A8A] text-amber-400 flex items-center justify-center"><f.icon size={22} weight="duotone"/></div>
              <h3 className="font-display text-lg font-bold text-[#1E3A8A] mt-4">{f.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
