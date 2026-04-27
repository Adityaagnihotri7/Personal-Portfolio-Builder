import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="min-h-[90vh] flex flex-col justify-center pt-20 md:pt-0">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        <motion.div 
          className="flex-1 space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Available for new opportunities
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Hi, I'm <br />
              <span className="text-gradient">Aditya D Agnihotri</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Software Developer | Java • DSA • AI Projects
            </p>
          </div>

          <p className="text-lg text-muted-foreground/80 max-w-xl leading-relaxed">
            I build scalable solutions and AI-powered applications that solve real-world problems.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a href="#projects" className="group relative px-8 py-4 rounded-xl font-medium text-white overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.3)] transition-shadow hover:shadow-[0_0_60px_rgba(124,58,237,0.5)]">
              <div className="absolute inset-0 bg-gradient-primary" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                View My Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            
            <a href="/resume.pdf" target="_blank" className="px-8 py-4 rounded-xl font-medium glass border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download CV
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="relative w-64 h-64 md:w-96 md:h-96"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-dashed animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border-2 border-accent/40 border-dotted animate-[spin_15s_linear_infinite_reverse]" />
          
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] flex items-center justify-center">
              <span className="text-8xl font-bold text-gradient opacity-80">A</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
