import { motion } from "framer-motion";

const IMGS = [
  "https://images.unsplash.com/photo-1785190095920-302ea67de2e0?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1778489769184-45868633c527?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1745012010615-47abbeb3e906?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1785190095869-0e76c869c0d1?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=srgb&fm=jpg&q=85",
];

export default function Gallery() {
  return (
    <div data-testid="gallery-page">
      <section className="relative py-24 bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Gallery</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-3 leading-tight">Moments from <span className="italic gradient-text-gold">our campus</span></h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {IMGS.map((src, i) => (
            <motion.div key={i} initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.03}} className="mb-5 break-inside-avoid overflow-hidden rounded-3xl group">
              <img src={src} alt={`Campus ${i}`} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ height: i%3===0 ? 380 : 260 }} data-testid={`gallery-img-${i}`} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
