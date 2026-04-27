import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  MapPin,
  Briefcase,
  Code2,
  ExternalLink,
  Sparkles,
  CircleDot,
  Send,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { TemplateProps } from ".";

function ContactBlock({ username }: { username: string }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 5) {
      toast({
        title: "Check your details",
        description: "Please fill in your name, valid email, and a short message.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      await api.contact({ username, ...form });
      toast({ title: "Message sent", description: "Thanks for reaching out!" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast({
        title: "Couldn't send",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input
        type="text"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        disabled={submitting}
        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
      />
      <input
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        disabled={submitting}
        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
      />
      <textarea
        rows={4}
        placeholder="Hi! I'd like to talk about…"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        disabled={submitting}
        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50 resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full group relative px-6 py-3 rounded-xl font-medium text-white overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.25)] hover:shadow-[0_0_60px_rgba(124,58,237,0.5)] disabled:opacity-70"
      >
        <div className="absolute inset-0 bg-gradient-primary" />
        <span className="relative flex items-center justify-center gap-2">
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send Message <Send className="w-4 h-4" />
            </>
          )}
        </span>
      </button>
    </form>
  );
}

export function NeonTemplate({ data }: TemplateProps) {
  const { user, projects, skills } = data;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const social = user.socialLinks ?? {};

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent origin-left z-50"
        style={{ scaleX }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(124,58,237,0.12), transparent 60%)`,
        }}
      />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-32">
        {/* HERO */}
        <section className="min-h-[80vh] flex flex-col justify-center">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              className="flex-1 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {user.isPro && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Pro
                </div>
              )}
              <p className="text-sm font-semibold text-gradient">Hi, my name is</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                <span className="text-gradient">{user.name}</span>
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-foreground/90">{user.role}</p>
              {user.bio && (
                <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#projects"
                  className="group relative px-7 py-3.5 rounded-xl font-medium text-white overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.35)] hover:shadow-[0_0_60px_rgba(124,58,237,0.55)]"
                >
                  <div className="absolute inset-0 bg-gradient-primary" />
                  <span className="relative">View My Work</span>
                </a>
                {user.resumeUrl && (
                  <a
                    href={user.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-7 py-3.5 rounded-xl font-medium glass border border-white/10 hover:border-white/20"
                  >
                    Download CV
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4">
                {user.location && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" /> {user.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-muted-foreground">
                  <CircleDot className="w-4 h-4 text-emerald-400" /> Open to Work
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-accent" /> {projects.length} projects
                </span>
              </div>
            </motion.div>

            <motion.div
              className="relative shrink-0"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div
                className="absolute -inset-6 rounded-full opacity-70 blur-2xl"
                style={{
                  background:
                    "conic-gradient(from 90deg, #7c3aed, #06b6d4, #7c3aed)",
                }}
              />
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full p-[3px] bg-[conic-gradient(from_0deg,#7c3aed,#06b6d4,#7c3aed)] animate-[spin_8s_linear_infinite]">
                <div className="w-full h-full rounded-full bg-background overflow-hidden flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-bold text-gradient">{initials}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SKILLS */}
        {skills.length > 0 && (
          <section id="skills" className="space-y-10 scroll-mt-24">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-gradient">Technical Arsenal</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-primary rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <GlassCard className="h-full hover:shadow-[0_0_30px_rgba(6,182,212,0.18)] group">
                    <h3 className="text-lg font-semibold mb-4 group-hover:text-primary transition-colors flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-accent" /> {cat.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:border-primary/40 transition-all"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        <section id="projects" className="space-y-10 scroll-mt-24">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-gradient">Featured Work</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-primary rounded-full" />
          </div>
          {projects.length === 0 ? (
            <p className="text-muted-foreground italic">No projects published yet.</p>
          ) : (
            <div className="grid gap-6">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <GlassCard className="group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[18px] opacity-0 group-hover:opacity-25 blur transition-opacity duration-500 pointer-events-none" />
                    <div className="relative flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                              {p.title}
                            </h3>
                            {p.subtitle && <p className="text-accent font-medium">{p.subtitle}</p>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {p.githubLink && (
                              <a
                                href={p.githubLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/40 text-muted-foreground transition-all"
                              >
                                <Github className="w-5 h-5" />
                              </a>
                            )}
                            {p.liveLink && (
                              <a
                                href={p.liveLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-full bg-white/5 hover:bg-accent/20 hover:text-accent border border-white/10 hover:border-accent/40 text-muted-foreground transition-all"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                        {p.description && (
                          <p className="text-muted-foreground leading-relaxed">{p.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {p.techStack.map((t) => (
                            <span
                              key={t}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT */}
        <section id="contact" className="space-y-10 scroll-mt-24">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-gradient">Get In Touch</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-primary rounded-full" />
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Have a project in mind, an opportunity, or just want to say hi? Drop a message — it goes straight to {user.name.split(" ")[0]}'s inbox.
              </p>
              <div className="flex flex-col gap-3">
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-3 py-2 rounded-xl glass hover:bg-white/10"
                  >
                    <Github className="w-4 h-4 text-primary" /> GitHub
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-3 py-2 rounded-xl glass hover:bg-white/10"
                  >
                    <Linkedin className="w-4 h-4 text-accent" /> LinkedIn
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-3 py-2 rounded-xl glass hover:bg-white/10"
                  >
                    <Twitter className="w-4 h-4 text-primary" /> Twitter
                  </a>
                )}
                {social.website && (
                  <a
                    href={social.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-3 py-2 rounded-xl glass hover:bg-white/10"
                  >
                    <Globe className="w-4 h-4 text-accent" /> Website
                  </a>
                )}
                <span className="inline-flex items-center gap-3 px-3 py-2 rounded-xl glass">
                  <Mail className="w-4 h-4 text-primary" /> via the form
                </span>
              </div>
            </div>
            <div className="md:col-span-3">
              <GlassCard className="p-6" hoverScale={false}>
                <ContactBlock username={user.username} />
              </GlassCard>
            </div>
          </div>
        </section>

        <footer className="pt-16 pb-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {user.name} · Built on{" "}
          <a href="/" className="text-gradient font-semibold">
            CodeFolio
          </a>
        </footer>
      </div>
    </div>
  );
}
