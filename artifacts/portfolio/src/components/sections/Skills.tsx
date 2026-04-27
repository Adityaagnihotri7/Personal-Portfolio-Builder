import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

const skillCategories = [
  {
    title: "Languages",
    skills: ["Java", "Python", "C", "JavaScript", "TypeScript"]
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "HTML", "CSS", "Tailwind"]
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "MongoDB", "MySQL", "PostgreSQL", "REST API", "WebSockets"]
  },
  {
    title: "Core CS",
    skills: ["DSA", "OOP", "DBMS", "OS"]
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "Docker", "AWS", "Postman", "VS Code", "Figma"]
  },
  {
    title: "Other",
    skills: ["Basic AI/ML", "Prompt Engineering"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Technical Arsenal</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-primary rounded-full" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, i) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <GlassCard className="h-full hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group">
              <h3 className="text-xl font-semibold mb-6 text-foreground group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
