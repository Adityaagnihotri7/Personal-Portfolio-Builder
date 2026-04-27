import { motion } from "framer-motion";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";

export function Projects() {
  const projects = [
    {
      title: "JCET Hub — Smart Campus Management & Engagement Platform",
      tech: ["Node.js", "Express.js", "PostgreSQL", "WebSockets", "Tailwind CSS"],
      description: [
        "Designed and developed a full-stack campus platform integrating event management, attendance tracking, and student engagement systems.",
        "Built dynamic event registration system with real-time updates and admin-controlled CRUD operations.",
        "Implemented QR-based attendance system for secure and automated student check-ins.",
        "Developed role-based dashboards (Admin, Faculty, Student) with real-time data synchronization.",
        "Integrated activity tracking, campus points system, and resume-building features for students.",
        "Ensured responsive UI/UX and scalable backend architecture for handling concurrent users.",
      ],
      github: "https://github.com/Adityaagnihotri7",
    },
    {
      title: "NextStop JGI — Real-Time College Bus Tracking System",
      tech: ["Node.js", "Express.js", "PostgreSQL", "WebSockets", "Tailwind CSS"],
      description: [
        "Architected and developed a full-stack real-time bus tracking platform with Student, Driver, and Admin modules.",
        "Designed responsive frontend workflows for structured route and stop selection.",
        "Implemented WebSocket-based live GPS synchronization for dynamic location updates.",
        "Integrated PostgreSQL database for persistent route, stop, and driver management.",
        "Deployed and maintained live version with iterative feature enhancements.",
      ],
      github: "https://github.com/Adityaagnihotri7",
    },
    {
      title: "AI-Powered Real-World System",
      tech: ["Python", "AI/ML", "Prompt Engineering"],
      description: [
        "Built an AI-powered application addressing a real-world problem; reached the Top 8 finalist position out of 50+ teams in a competitive hackathon.",
        "Designed and prototyped the end-to-end solution with intuitive interaction and intelligent automation.",
      ],
      github: "https://github.com/Adityaagnihotri7",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">Featured Projects</h2>
            <div className="h-[1px] flex-grow bg-border mt-2"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-12"
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative grid md:grid-cols-12 gap-6 items-center"
              >
                {/* Decorative background block that expands on hover */}
                <div className="absolute inset-0 -mx-6 -my-6 bg-muted/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 hidden md:block"></div>

                <div className="md:col-span-12 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-primary font-mono text-sm mb-2">
                        <FolderGit2 className="w-4 h-4" />
                        <span>Project {index + 1}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  </div>

                  <div className="bg-card border border-border p-6 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow relative z-10 text-muted-foreground text-sm leading-relaxed">
                    <ul className="space-y-3 list-disc pl-4 marker:text-primary/50">
                      {project.description.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>

                  <ul className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                    {project.tech.map((tech, i) => (
                      <li key={i} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
