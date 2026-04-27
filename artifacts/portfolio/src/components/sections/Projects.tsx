import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Github, ExternalLink, Server, Database, Code2, ShieldCheck } from "lucide-react";

const projects = [
  {
    title: "JCET Hub",
    subtitle: "Smart Campus Management & Engagement Platform",
    description:
      "A full-stack campus platform integrating event management, QR-based attendance, and real-time engagement using WebSockets. Features role-based dashboards (Admin, Faculty, Student), activity tracking, and resume-building tools.",
    tech: ["Node.js", "Express.js", "PostgreSQL", "WebSockets", "Tailwind CSS"],
    github: "https://github.com/AnmolMathad15/JCET_HUB",
    icon: Database,
  },
  {
    title: "NextStop JGI",
    subtitle: "Real-Time College Bus Tracking System",
    description:
      "A real-time GPS-based bus tracking system with Student, Driver, and Admin modules. Uses WebSockets for live updates and PostgreSQL for route and data management.",
    tech: ["Node.js", "Express.js", "PostgreSQL", "WebSockets"],
    github: "https://github.com/AnmolMathad15/Nextstop--JGI",
    icon: Server,
  },
  {
    title: "AI Complaint Resolver",
    subtitle: "Intelligent Ticket Triage & Resolution",
    description:
      "An AI-powered complaint resolution system that analyzes user queries and generates intelligent responses using NLP and automation workflows.",
    tech: ["Python", "AI/ML", "NLP", "APIs"],
    github:
      "https://github.com/AnmolMathad15/AICustomerComplaintResolutionAgent-ResolveAI-Hackoclock",
    icon: Code2,
  },
  {
    title: "TrustChain AI",
    subtitle: "Blockchain + AI for Trusted Data",
    description:
      "A blockchain + AI-powered system designed to ensure trust, transparency, and secure data handling in digital ecosystems.",
    tech: ["Blockchain", "AI", "Web Tech"],
    github: "https://github.com/AnmolMathad15/TrustChain",
    icon: ShieldCheck,
  },
];

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Featured Work</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-primary rounded-full" />
        <p className="text-muted-foreground max-w-2xl">
          A selection of full-stack and AI projects I've built end-to-end — from architecture to deployment.
        </p>
      </div>

      <div className="grid gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <GlassCard className="group overflow-visible">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[18px] opacity-0 group-hover:opacity-25 blur transition-opacity duration-500 pointer-events-none" />

              <div className="relative flex flex-col md:flex-row gap-8 items-start">
                <div className="hidden md:flex p-6 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 border border-white/10 items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all duration-500 shrink-0">
                  <project.icon className="w-12 h-12" />
                </div>

                <div className="flex-1 space-y-4 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-accent font-medium">{project.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} on GitHub`}
                        className="p-2.5 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/40 text-muted-foreground transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title}`}
                        className="p-2.5 rounded-full bg-white/5 hover:bg-accent/20 hover:text-accent border border-white/10 hover:border-accent/40 text-muted-foreground transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-colors"
                      >
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
