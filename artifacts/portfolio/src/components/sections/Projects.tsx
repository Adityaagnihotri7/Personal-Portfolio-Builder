import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Github, ExternalLink, Server, Database, Code2 } from "lucide-react";

const projects = [
  {
    title: "JCET Hub",
    subtitle: "Smart Campus Management & Engagement Platform",
    description: "Full-stack campus platform integrating event management, QR-based attendance, role-based dashboards (Admin/Faculty/Student), and a campus points + resume-building system. Real-time updates via WebSockets, deployed live.",
    tech: ["Node.js", "Express.js", "PostgreSQL", "WebSockets", "Tailwind CSS"],
    github: "https://github.com/Adityaagnihotri7",
    icon: Database
  },
  {
    title: "NextStop JGI",
    subtitle: "Real-Time College Bus Tracking System",
    description: "Real-time bus tracking platform with Student, Driver, and Admin modules. WebSocket-based live GPS sync, structured route/stop selection, and persistent route management.",
    tech: ["Node.js", "Express.js", "PostgreSQL", "WebSockets", "Tailwind CSS"],
    github: "https://github.com/Adityaagnihotri7",
    icon: Server
  },
  {
    title: "AI Complaint Resolver",
    subtitle: "Automated Ticket Triage",
    description: "AI-powered system that classifies, routes, and drafts resolutions for incoming complaints using LLM prompt pipelines. Built as a real-world AI workflow demo.",
    tech: ["Python", "AI/ML", "Prompt Engineering", "REST API"],
    github: "https://github.com/Adityaagnihotri7",
    icon: Code2
  }
];

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Featured Work</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-primary rounded-full" />
      </div>

      <div className="grid gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <GlassCard className="group overflow-visible">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[18px] opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
              
              <div className="relative flex flex-col md:flex-row gap-8 items-start">
                <div className="hidden md:flex p-6 rounded-2xl bg-white/5 border border-white/10 items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  <project.icon className="w-12 h-12" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-accent font-medium">{project.subtitle}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <a href={project.github} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                      <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map(tech => (
                      <span key={tech} className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
