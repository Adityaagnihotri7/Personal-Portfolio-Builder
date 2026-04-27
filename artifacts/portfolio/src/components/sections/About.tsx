import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Code2, Trophy, Star, Users } from "lucide-react";

export function About() {
  const stats = [
    { label: "Projects", value: "20+", icon: Code2 },
    { label: "Experience", value: "2+ Yrs", icon: Star },
    { label: "Clients", value: "15+", icon: Users },
    { label: "Rating", value: "5★", icon: Trophy },
  ];

  return (
    <section id="about" className="scroll-mt-24 space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">About Me</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-primary rounded-full" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div 
          className="space-y-6 text-lg text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p>
            I'm a Computer Science student focused on becoming a high-impact Software Developer. I specialize in Java, Data Structures & Algorithms, and building real-world projects including AI-powered systems.
          </p>
          <p>
            I've worked on innovative solutions and reached the <strong className="text-foreground">Top 8 in a competitive hackathon</strong>. Currently, I'm strengthening DSA, building scalable projects, and preparing for top product-based companies.
          </p>
          
          <div className="pt-4 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Key Achievements</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Top 8 Hackathon Finalist (50+ teams)
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Built AI-based real-world systems
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Strong DSA foundation
              </li>
            </ul>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <GlassCard className="flex flex-col items-center justify-center text-center p-8 space-y-4 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                <div className="p-3 rounded-full bg-white/5 text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
