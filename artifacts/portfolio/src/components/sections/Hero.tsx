import { motion } from "framer-motion";
import { Download, ArrowRight, Sparkles, MapPin, Briefcase, CircleDot } from "lucide-react";
import profilePhoto from "@assets/WhatsApp_Image_2026-04-27_at_10.20.52_PM_1777310809194.jpeg";

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
          <div className="text-sm font-medium text-muted-foreground tracking-wide">
            <span className="text-gradient font-semibold">Hi, my name is</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              <span className="text-gradient">Aditya D</span>
              <br />
              <span className="text-gradient">Agnihotri</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 font-semibold">
              Software Developer
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-medium">
              Java <span className="text-primary">•</span> DSA <span className="text-primary">•</span> AI Projects
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

          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Location</div>
                <div className="text-sm font-semibold">India</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Experience</div>
                <div className="text-sm font-semibold">2+ Years</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center">
                <CircleDot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Availability</div>
                <div className="text-sm font-semibold flex items-center gap-2">
                  Open to Work
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative w-64 h-64 md:w-96 md:h-96 shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Outer ambient glow */}
          <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.45)_0%,rgba(6,182,212,0.25)_40%,transparent_70%)] blur-3xl" />

          {/* Rotating gradient ring */}
          <motion.div
            className="absolute inset-0 rounded-full p-[3px] bg-[conic-gradient(from_0deg,#7c3aed,#06b6d4,#a855f7,#7c3aed)] shadow-[0_0_60px_rgba(124,58,237,0.55)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 14, ease: "linear", repeat: Infinity }}
          >
            <div className="w-full h-full rounded-full bg-background" />
          </motion.div>

          {/* Inner subtle dotted ring */}
          <div className="absolute inset-3 rounded-full border border-dashed border-white/10 animate-[spin_24s_linear_infinite_reverse]" />

          {/* Photo */}
          <div className="absolute inset-[14px] rounded-full overflow-hidden border border-white/10 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]">
            <img
              src={profilePhoto}
              alt="Aditya D Agnihotri"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.15),transparent_60%)] mix-blend-screen" />
          </div>

          {/* Floating availability badge */}
          <motion.div
            className="absolute -bottom-2 -right-2 md:bottom-4 md:-right-6 glass rounded-2xl px-4 py-3 border border-white/10 shadow-[0_10px_40px_rgba(124,58,237,0.35)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Available for</div>
                <div className="text-sm font-semibold text-gradient">new opportunities</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
