import { motion } from "framer-motion";
import { Quotes, Target, Eye, Heart } from "@phosphor-icons/react";

const CAMPUS = "https://images.unsplash.com/photo-1785190095869-0e76c869c0d1?crop=entropy&cs=srgb&fm=jpg&q=85";

export default function About() {
  return (
    <div data-testid="about-page">
      <section className="relative py-24 bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">About Us</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-3 leading-tight max-w-3xl">A school with a soul, in the heart of <span className="italic gradient-text-gold">Nalanda</span></h1>
          <p className="mt-6 text-blue-100 text-lg max-w-2xl">The Foundation Academy is more than an institution — it is a promise made to every child who walks through our gates: to nurture, challenge, and prepare them for life.</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <motion.img initial={{opacity:0, x:-30}} whileInView={{opacity:1, x:0}} viewport={{once:true}} src={CAMPUS} alt="Campus" className="rounded-3xl shadow-2xl shadow-blue-900/10 w-full h-[480px] object-cover" />
          <motion.div initial={{opacity:0, x:30}} whileInView={{opacity:1, x:0}} viewport={{once:true}}>
            <div className="text-xs uppercase tracking-widest text-amber-600 font-bold">Our Story</div>
            <h2 className="font-display text-4xl font-bold text-[#1E3A8A] mt-3 leading-tight">Rooted in rural Bihar. Aiming for the world.</h2>
            <p className="mt-6 text-slate-700 leading-relaxed">Founded with a simple conviction — that a child in Harnaut deserves the same opportunities as one in Delhi or Mumbai — The Foundation Academy has grown into one of the most trusted English-medium schools in Nalanda district.</p>
            <p className="mt-4 text-slate-700 leading-relaxed">From smart digital classrooms to competitive exam foundation programs, we combine the discipline of CBSE with the ambitions of the modern world.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Our Mission", body: "Provide affordable, world-class English-medium CBSE education that builds strong academic and moral foundations." },
            { icon: Eye, title: "Our Vision", body: "To be the most trusted early-education school in Bihar — known for character, curiosity, and results." },
            { icon: Heart, title: "Our Values", body: "Discipline, empathy, curiosity, and the courage to dream. These four words guide every decision we make." },
          ].map((v, i) => (
            <motion.div key={v.title} initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="rounded-3xl bg-white border border-slate-200 p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A] text-amber-400 flex items-center justify-center"><v.icon size={24} weight="duotone"/></div>
              <h3 className="font-display text-2xl font-bold text-[#1E3A8A] mt-5">{v.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
