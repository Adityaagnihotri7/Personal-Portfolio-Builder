import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Briefcase } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      role: "Full Stack Developer",
      company: "TechSolutions Inc.",
      duration: "Jan 2023 – Present",
      description: "Building scalable full-stack web applications, real-time systems, and AI-augmented internal tools. Leading frontend architecture and contributing across the stack."
    }
  ];

  return (
    <section id="experience" className="scroll-mt-24 space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Experience</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-primary rounded-full" />
      </div>

      <div className="relative pl-4 md:pl-0">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[15px] md:left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-primary via-accent to-transparent" />

        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative pl-10 md:pl-20"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-4 top-6 w-8 h-8 -translate-x-1/2 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)] z-10">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>

              <GlassCard className="relative group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{exp.role}</h3>
                    <p className="text-lg text-accent font-medium">{exp.company}</p>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium whitespace-nowrap text-muted-foreground">
                    {exp.duration}
                  </span>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
