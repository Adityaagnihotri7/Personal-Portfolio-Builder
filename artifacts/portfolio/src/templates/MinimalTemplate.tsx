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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { TemplateProps } from ".";

function MiniContact({ username }: { username: string }) {
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
      toast({ title: "Message sent" });
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
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        disabled={submitting}
        className="w-full bg-white border border-zinc-200 rounded-md px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-900 placeholder:text-zinc-400"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        disabled={submitting}
        className="w-full bg-white border border-zinc-200 rounded-md px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-900 placeholder:text-zinc-400"
      />
      <textarea
        rows={4}
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        disabled={submitting}
        className="w-full bg-white border border-zinc-200 rounded-md px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-900 placeholder:text-zinc-400 resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-700 disabled:opacity-70"
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export function MinimalTemplate({ data }: TemplateProps) {
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
    <div className="min-h-screen w-full bg-white text-zinc-900">
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-20">
        <header className="space-y-6">
          <div className="flex items-center gap-5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-2xl font-bold text-zinc-600">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-zinc-600">
                {user.role}
                {user.location ? ` · ${user.location}` : ""}
              </p>
            </div>
            {user.isPro && (
              <span className="ml-auto text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded bg-zinc-900 text-white">
                Pro
              </span>
            )}
          </div>
          {user.bio && <p className="text-lg text-zinc-700 leading-relaxed">{user.bio}</p>}
          <div className="flex flex-wrap gap-3 text-sm text-zinc-600">
            {user.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {user.location}
              </span>
            )}
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-zinc-900"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-zinc-900"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-zinc-900"
              >
                <Twitter className="w-4 h-4" /> Twitter
              </a>
            )}
            {social.website && (
              <a
                href={social.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-zinc-900"
              >
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        </header>

        {skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Skills
            </h2>
            <div className="space-y-3">
              {skills.map((cat) => (
                <div key={cat.id} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <span className="w-32 shrink-0 font-medium">{cat.category}</span>
                  <span className="text-zinc-600">{cat.items.join(" · ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Projects
          </h2>
          {projects.length === 0 ? (
            <p className="text-zinc-500 italic">No projects published yet.</p>
          ) : (
            <div className="space-y-8">
              {projects.map((p) => (
                <article key={p.id} className="space-y-2 border-b border-zinc-100 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      {p.subtitle && <p className="text-zinc-500 text-sm">{p.subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      {p.githubLink && (
                        <a
                          href={p.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-zinc-900"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {p.liveLink && (
                        <a
                          href={p.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-zinc-900"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && <p className="text-zinc-700 leading-relaxed">{p.description}</p>}
                  {p.techStack.length > 0 && (
                    <p className="text-xs text-zinc-500">{p.techStack.join(" · ")}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Contact
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-zinc-700 leading-relaxed inline-flex items-start gap-2">
              <Mail className="w-4 h-4 mt-1 text-zinc-500" /> Send a message — it goes straight to{" "}
              {user.name.split(" ")[0]}'s inbox.
            </p>
            <MiniContact username={user.username} />
          </div>
        </section>

        <footer className="pt-12 text-sm text-zinc-500 border-t border-zinc-100">
          © {new Date().getFullYear()} {user.name} · Built on{" "}
          <a href="/" className="font-semibold text-zinc-900">
            CodeFolio
          </a>
        </footer>
      </div>
    </div>
  );
}
