import { useState } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  ExternalLink,
  Send,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSendContactMessage } from "@/lib/api";
import type { PortfolioData } from "@/lib/portfolioTypes";

function MiniContact({ username, ownerName }: { username: string; ownerName: string }) {
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
      toast({ title: "Message sent", description: `${ownerName.split(" ")[0]} will reply soon.` });
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
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        disabled={sendMessage.isPending}
        data-testid="input-mini-name"
        className="w-full rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        disabled={sendMessage.isPending}
        data-testid="input-mini-email"
        className="w-full rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
      />
      <textarea
        rows={4}
        placeholder="Your message"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        disabled={sendMessage.isPending}
        data-testid="input-mini-message"
        className="w-full resize-none rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
      />
      <button
        type="submit"
        disabled={sendMessage.isPending}
        data-testid="button-mini-submit"
        className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-800 disabled:opacity-70"
      >
        {sendMessage.isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending…
          </>
        ) : (
          <>
            Send <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

export function MinimalTemplate({ data }: { data: PortfolioData }) {
  const { user, projects, skills } = data;
  const social = user.socialLinks ?? {};
  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* HERO */}
        <section className="space-y-6 border-b border-zinc-200 pb-16">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white text-2xl font-semibold">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex-1">
              {user.isPro && (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  <Sparkles className="h-3 w-3" /> Pro
                </span>
              )}
              <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
                {user.name}
              </h1>
              {user.headline && (
                <p className="mt-1 text-lg text-zinc-600">{user.headline}</p>
              )}
              {user.location && (
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-zinc-500">
                  <MapPin className="h-3.5 w-3.5" /> {user.location}
                </p>
              )}
            </div>
          </div>
          {user.bio && (
            <p className="max-w-prose leading-relaxed text-zinc-700">{user.bio}</p>
          )}
          <div className="flex flex-wrap gap-3 text-sm">
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:border-zinc-400"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:border-zinc-400"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:border-zinc-400"
              >
                <Twitter className="h-4 w-4" /> Twitter
              </a>
            )}
            {social.website && (
              <a
                href={social.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:border-zinc-400"
              >
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
            {user.resumeUrl && (
              <a
                href={user.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800"
              >
                Resume
              </a>
            )}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="space-y-8 border-b border-zinc-200 py-16">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">Selected Work</h2>
          {projects.length === 0 ? (
            <p className="text-zinc-500">No projects yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-2 py-5 md:flex-row md:items-start md:justify-between"
                  data-testid={`mini-project-${p.id}`}
                >
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    {p.description && (
                      <p className="max-w-prose text-zinc-600">{p.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {p.techStack.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs text-zinc-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-sm">
                    {p.githubLink && (
                      <a
                        href={p.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 hover:border-zinc-400"
                      >
                        <Github className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                    {p.liveLink && (
                      <a
                        href={p.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 hover:border-zinc-400"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Live
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* SKILLS */}
        {skills.length > 0 && (
          <section id="skills" className="space-y-6 border-b border-zinc-200 py-16">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">Toolkit</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {skills.map((s) => (
                <div key={s.id}>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    {s.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-sm text-zinc-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="space-y-6 py-16">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              Say hello
            </h2>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-zinc-500">
              <Mail className="h-3.5 w-3.5" /> Messages go straight to {user.name.split(" ")[0]}
            </p>
          </div>
          <MiniContact username={user.username} ownerName={user.name} />
        </section>

        <footer className="border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} {user.name} · Built on{" "}
          <a href={import.meta.env.BASE_URL} className="text-zinc-900 hover:underline">
            CodeFolio
          </a>
        </footer>
      </div>
    </div>
  );
}
