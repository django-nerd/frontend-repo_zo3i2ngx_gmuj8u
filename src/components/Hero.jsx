import { motion } from 'framer-motion'
import Spline from '@splinetool/react-spline'

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="snow"></div>
        <div className="snow snow2"></div>
        <div className="snow snow3"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
        <div className="relative z-10 px-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight"
          >
            GiftFlow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-lg md:text-xl text-blue-100 max-w-xl"
          >
            A magical, automated Secret Santa — create events, invite friends, build wishlists, and reveal matches with festive flair.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 flex items-center gap-3"
          >
            <a href="#create" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/30 transition">
              Create an event
            </a>
            <a href="#events" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur border border-white/20 transition">
              View events
            </a>
          </motion.div>
        </div>
        <div className="relative w-full h-[340px] md:h-[440px] lg:h-[520px]">
          <div className="absolute inset-0 -right-10">
            <Spline scene="https://prod.spline.design/5fQlL0qinzob1I8q/scene.splinecode" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
