import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
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
import { useToast } from "@/hooks/use-toast";
import { useSendContactMessage } from "@/lib/api";
import type { PortfolioData } from "@/lib/portfolioTypes";

function ContactForm({ username, ownerName }: { username: string; ownerName: string }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const sendMessage = useSendContactMessage();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !/^\S+@\S+\.\S+$/.test(form.email) ||
      form.message.trim().length < 5
    ) {
      toast({
        title: "Check your details",
        description: "Name, valid email, and a short message please.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendMessage.mutateAsync({ data: { username, ...form } });
      toast({ title: "Message sent", description: `${ownerName.split(" ")[0]} will be in touch.` });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast({
        title: "Couldn't send",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input
        type="text"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        disabled={sendMessage.isPending}
        data-testid="input-contact-name"
        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      />
      <input
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        disabled={sendMessage.isPending}
        data-testid="input-contact-email"
        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      />
      <textarea
        rows={4}
        placeholder="Hi! I'd like to talk about…"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        disabled={sendMessage.isPending}
        data-testid="input-contact-message"
        className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      />
      <button
        type="submit"
        disabled={sendMessage.isPending}
        data-testid="button-contact-submit"
        className="group relative w-full overflow-hidden rounded-xl px-6 py-3 font-medium text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] disabled:opacity-70"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-500" />
        <span className="relative flex items-center justify-center gap-2">
          {sendMessage.isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
              Sending…
            </>
          ) : (
            <>
              Send message <Send className="h-4 w-4" />
            </>
          )}
        </span>
      </button>
    </form>
  );
}

export function NeonTemplate({ data }: { data: PortfolioData }) {
  const { user, projects, skills } = data;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
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
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100">
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-cyan-400 to-violet-500"
        style={{ scaleX }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(124,58,237,0.12), transparent 60%)`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute -right-[10%] top-[40%] h-[50%] w-[50%] rounded-full bg-violet-500/15 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl space-y-32 px-6 py-16 md:py-24">
        {/* HERO */}
        <section className="flex min-h-[80vh] flex-col justify-center">
          <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-20">
            <motion.div
              className="flex-1 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {user.isPro && (
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" /> Pro
                </div>
              )}
              <p className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-sm font-semibold text-transparent">
                Hi, my name is
              </p>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                <span className="bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {user.name}
                </span>
              </h1>
              {user.headline && (
                <p className="text-xl font-semibold text-slate-100/90 md:text-2xl">
                  {user.headline}
                </p>
              )}
              {user.bio && (
                <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-400 lg:mx-0">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
                <a
                  href="#projects"
                  className="group relative overflow-hidden rounded-xl px-7 py-3.5 font-medium text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.35)] hover:shadow-[0_0_60px_rgba(34,211,238,0.55)]"
                  data-testid="link-view-work"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-500" />
                  <span className="relative">View My Work</span>
                </a>
                {user.resumeUrl && (
                  <a
                    href={user.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-medium backdrop-blur hover:border-white/20"
                    data-testid="link-resume"
                  >
                    Download CV
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 lg:justify-start">
                {user.location && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 backdrop-blur">
                    <MapPin className="h-4 w-4 text-cyan-300" /> {user.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 backdrop-blur">
                  <CircleDot className="h-4 w-4 text-emerald-400" /> Open to Work
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 backdrop-blur">
                  <Briefcase className="h-4 w-4 text-violet-400" />{" "}
                  {projects.length} projects
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
              <div className="relative h-56 w-56 animate-[spin_8s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#7c3aed,#06b6d4,#7c3aed)] p-[3px] md:h-72 md:w-72">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-6xl font-bold text-transparent">
                      {initials}
                    </span>
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
              <h2 className="text-3xl font-bold md:text-4xl">
                <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  Technical Arsenal
                </span>
              </h2>
              <div className="h-1 w-20 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group h-full rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur hover:shadow-[0_0_30px_rgba(6,182,212,0.18)]"
                >
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold transition-colors group-hover:text-cyan-300">
                    <Code2 className="h-4 w-4 text-violet-400" /> {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/15 hover:text-slate-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        <section id="projects" className="space-y-10 scroll-mt-24">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Featured Work
              </span>
            </h2>
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          </div>
          {projects.length === 0 ? (
            <p className="italic text-slate-500">No projects published yet.</p>
          ) : (
            <div className="grid gap-6">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur"
                  data-testid={`card-project-${p.id}`}
                >
                  <div className="pointer-events-none absolute -inset-1 rounded-[18px] bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 blur transition-opacity duration-500 group-hover:opacity-25" />
                  <div className="relative flex flex-col gap-6 md:flex-row">
                    {p.imageUrl && (
                      <div className="md:w-56 shrink-0 overflow-hidden rounded-xl border border-white/10">
                        <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                        <h3 className="text-xl font-bold transition-colors group-hover:text-cyan-300 md:text-2xl">
                          {p.title}
                        </h3>
                        <div className="flex shrink-0 items-center gap-2">
                          {p.githubLink && (
                            <a
                              href={p.githubLink}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/15 hover:text-cyan-300"
                              aria-label="GitHub"
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          )}
                          {p.liveLink && (
                            <a
                              href={p.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-all hover:border-violet-400/40 hover:bg-violet-400/15 hover:text-violet-300"
                              aria-label="Live"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      {p.description && (
                        <p className="leading-relaxed text-slate-400">{p.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {p.techStack.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT */}
        <section id="contact" className="space-y-10 scroll-mt-24">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            <div className="space-y-4 md:col-span-2">
              <p className="leading-relaxed text-slate-400">
                Have a project in mind, an opportunity, or just want to say hi?
                Drop a message — it goes straight to {user.name.split(" ")[0]}.
              </p>
              <div className="flex flex-col gap-3">
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur hover:bg-white/10"
                  >
                    <Github className="h-4 w-4 text-cyan-300" /> GitHub
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur hover:bg-white/10"
                  >
                    <Linkedin className="h-4 w-4 text-violet-400" /> LinkedIn
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur hover:bg-white/10"
                  >
                    <Twitter className="h-4 w-4 text-cyan-300" /> Twitter
                  </a>
                )}
                {social.website && (
                  <a
                    href={social.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur hover:bg-white/10"
                  >
                    <Globe className="h-4 w-4 text-violet-400" /> Website
                  </a>
                )}
                <span className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
                  <Mail className="h-4 w-4 text-cyan-300" /> via the form
                </span>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur">
                <ContactForm username={user.username} ownerName={user.name} />
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-8 pt-16 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {user.name} · Built on{" "}
          <a
            href={import.meta.env.BASE_URL}
            className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text font-semibold text-transparent"
          >
            CodeFolio
          </a>
        </footer>
      </div>
    </div>
  );
}
