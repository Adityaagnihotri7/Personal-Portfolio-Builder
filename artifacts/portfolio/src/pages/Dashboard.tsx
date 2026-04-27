import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { LogOut, Plus, Save, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { templateOptions } from "@/templates";
import { useToast } from "@/hooks/use-toast";
import type { Project, Skill } from "@/lib/types";

const BASE = import.meta.env.BASE_URL;

type Tab = "profile" | "projects" | "skills" | "template";

export function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, logout, setUser } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("profile");
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) setLocation("/login");
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (!user) return;
    Promise.all([api.listProjects(), api.listSkills()])
      .then(([p, s]) => {
        setProjects(p.projects);
        setSkills(s.skills);
      })
      .catch((err) => {
        toast({
          title: "Failed to load data",
          description: err instanceof Error ? err.message : "",
          variant: "destructive",
        });
      });
  }, [user, toast]);

  const previewSrc = useMemo(
    () => (user ? `${BASE}${user.username}?preview=1&v=${previewKey}` : ""),
    [user, previewKey],
  );

  function refreshPreview() {
    setPreviewKey((k) => k + 1);
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            <span className="font-bold">CodeFolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/${user.username}`}
              className="text-sm font-medium px-3 py-1.5 rounded-lg glass border border-white/10 hover:border-primary/40 inline-flex items-center gap-2"
            >
              View public <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => {
                logout();
                setLocation("/");
              }}
              className="text-sm font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-6 grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["profile", "projects", "skills", "template"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-colors ${
                  tab === t
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "glass border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="glass rounded-2xl p-6 border border-white/10 space-y-5"
          >
            {tab === "profile" && (
              <ProfileForm
                onSaved={(u) => {
                  setUser(u);
                  refreshPreview();
                  toast({ title: "Profile saved" });
                }}
              />
            )}
            {tab === "projects" && (
              <ProjectsEditor
                projects={projects}
                setProjects={(updater) => {
                  setProjects(updater);
                  refreshPreview();
                }}
              />
            )}
            {tab === "skills" && (
              <SkillsEditor
                skills={skills}
                setSkills={(updater) => {
                  setSkills(updater);
                  refreshPreview();
                }}
              />
            )}
            {tab === "template" && (
              <TemplatePicker
                current={user.templateId}
                onSaved={(u) => {
                  setUser(u);
                  refreshPreview();
                  toast({ title: "Template updated" });
                }}
              />
            )}
          </motion.div>
        </div>

        <div className="space-y-3 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Live preview
            </p>
            <button
              onClick={refreshPreview}
              className="text-xs font-medium px-2 py-1 rounded-lg glass border border-white/10 inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-background h-full min-h-[600px]">
            <iframe
              key={previewKey}
              src={previewSrc}
              className="w-full h-full"
              title="Portfolio preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileForm({ onSaved }: { onSaved: (u: import("@/lib/types").PublicUser) => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user!.name,
    bio: user!.bio,
    role: user!.role,
    location: user!.location,
    avatarUrl: user!.avatarUrl,
    resumeUrl: user!.resumeUrl,
    socialLinks: { ...user!.socialLinks },
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function onSave() {
    setSaving(true);
    try {
      const res = await api.updateUser(form);
      onSaved(res.user);
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>
      <Field label="Display name">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputCls}
        />
      </Field>
      <Field label="Role / Headline">
        <input
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className={inputCls}
          placeholder="Software Developer"
        />
      </Field>
      <Field label="Location">
        <input
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className={inputCls}
          placeholder="India"
        />
      </Field>
      <Field label="Bio">
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          className={`${inputCls} resize-none`}
          placeholder="One sentence about what you build."
        />
      </Field>
      <Field label="Avatar URL">
        <input
          value={form.avatarUrl}
          onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
          className={inputCls}
          placeholder="https://…"
        />
      </Field>
      <Field label="Resume URL (optional)">
        <input
          value={form.resumeUrl}
          onChange={(e) => setForm((f) => ({ ...f, resumeUrl: e.target.value }))}
          className={inputCls}
          placeholder="https://…/cv.pdf"
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        {(["github", "linkedin", "twitter", "website"] as const).map((k) => (
          <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
            <input
              value={form.socialLinks[k] ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  socialLinks: { ...f.socialLinks, [k]: e.target.value },
                }))
              }
              className={inputCls}
              placeholder="https://…"
            />
          </Field>
        ))}
      </div>
      <button onClick={onSave} disabled={saving} className={primaryBtn}>
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

function ProjectsEditor({
  projects,
  setProjects,
}: {
  projects: Project[];
  setProjects: (updater: (p: Project[]) => Project[]) => void;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function addProject() {
    setBusy("new");
    try {
      const res = await api.createProject({
        title: "New Project",
        subtitle: "",
        description: "",
        techStack: [],
        githubLink: "",
        liveLink: "",
        sortOrder: projects.length + 1,
      });
      setProjects((cur) => [...cur, res.project]);
    } catch (err) {
      toast({
        title: "Couldn't add",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  }

  async function update(p: Project, patch: Partial<Project>) {
    setBusy(p.id);
    try {
      const res = await api.updateProject(p.id, patch);
      setProjects((cur) => cur.map((x) => (x.id === p.id ? res.project : x)));
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    setBusy(id);
    try {
      await api.deleteProject(id);
      setProjects((cur) => cur.filter((x) => x.id !== id));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects ({projects.length})</h2>
        <button onClick={addProject} disabled={busy === "new"} className={primaryBtn}>
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {projects.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No projects yet — add your first one.</p>
      )}
      <div className="space-y-3">
        {projects.map((p) => (
          <ProjectRow
            key={p.id}
            project={p}
            saving={busy === p.id}
            onSave={(patch) => update(p, patch)}
            onDelete={() => remove(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  saving,
  onSave,
  onDelete,
}: {
  project: Project;
  saving: boolean;
  onSave: (patch: Partial<Project>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [draft, setDraft] = useState({
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    techStack: project.techStack.join(", "),
    githubLink: project.githubLink,
    liveLink: project.liveLink,
  });

  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-3 bg-white/[0.02]">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={inputCls}
          placeholder="Title"
        />
        <input
          value={draft.subtitle}
          onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
          className={inputCls}
          placeholder="Subtitle"
        />
      </div>
      <textarea
        rows={2}
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        className={`${inputCls} resize-none`}
        placeholder="Description"
      />
      <input
        value={draft.techStack}
        onChange={(e) => setDraft({ ...draft, techStack: e.target.value })}
        className={inputCls}
        placeholder="Tech (comma separated): React, Node.js, Postgres"
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={draft.githubLink}
          onChange={(e) => setDraft({ ...draft, githubLink: e.target.value })}
          className={inputCls}
          placeholder="GitHub URL"
        />
        <input
          value={draft.liveLink}
          onChange={(e) => setDraft({ ...draft, liveLink: e.target.value })}
          className={inputCls}
          placeholder="Live URL (optional)"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <button onClick={onDelete} disabled={saving} className={dangerBtn}>
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            onSave({
              ...draft,
              techStack: draft.techStack
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          disabled={saving}
          className={primaryBtn}
        >
          <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function SkillsEditor({
  skills,
  setSkills,
}: {
  skills: Skill[];
  setSkills: (updater: (s: Skill[]) => Skill[]) => void;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function add() {
    setBusy("new");
    try {
      const res = await api.createSkill({
        category: "New Category",
        items: [],
        sortOrder: skills.length + 1,
      });
      setSkills((cur) => [...cur, res.skill]);
    } catch (err) {
      toast({
        title: "Add failed",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  }

  async function update(s: Skill, patch: Partial<Skill>) {
    setBusy(s.id);
    try {
      const res = await api.updateSkill(s.id, patch);
      setSkills((cur) => cur.map((x) => (x.id === s.id ? res.skill : x)));
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this skill group?")) return;
    setBusy(id);
    try {
      await api.deleteSkill(id);
      setSkills((cur) => cur.filter((x) => x.id !== id));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Skills ({skills.length})</h2>
        <button onClick={add} disabled={busy === "new"} className={primaryBtn}>
          <Plus className="w-4 h-4" /> Add group
        </button>
      </div>
      <div className="space-y-3">
        {skills.map((s) => (
          <SkillRow
            key={s.id}
            skill={s}
            saving={busy === s.id}
            onSave={(patch) => update(s, patch)}
            onDelete={() => remove(s.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SkillRow({
  skill,
  saving,
  onSave,
  onDelete,
}: {
  skill: Skill;
  saving: boolean;
  onSave: (patch: Partial<Skill>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [draft, setDraft] = useState({
    category: skill.category,
    items: skill.items.join(", "),
  });

  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-3 bg-white/[0.02]">
      <input
        value={draft.category}
        onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        className={inputCls}
        placeholder="Category (e.g. Frontend)"
      />
      <input
        value={draft.items}
        onChange={(e) => setDraft({ ...draft, items: e.target.value })}
        className={inputCls}
        placeholder="Items (comma separated): React, Vite, Tailwind"
      />
      <div className="flex items-center justify-between">
        <button onClick={onDelete} disabled={saving} className={dangerBtn}>
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            onSave({
              category: draft.category,
              items: draft.items
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          disabled={saving}
          className={primaryBtn}
        >
          <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function TemplatePicker({
  current,
  onSaved,
}: {
  current: string;
  onSaved: (u: import("@/lib/types").PublicUser) => void;
}) {
  const [picked, setPicked] = useState(current);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function save() {
    setSaving(true);
    try {
      const res = await api.updateUser({ templateId: picked as "neon" | "minimal" });
      onSaved(res.user);
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Template</h2>
      <p className="text-sm text-muted-foreground">
        Switch the look of your public portfolio. Your data stays the same.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {templateOptions.map((t) => (
          <button
            key={t.id}
            onClick={() => setPicked(t.id)}
            className={`text-left p-4 rounded-xl border transition-colors ${
              picked === t.id
                ? "border-primary/60 bg-primary/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <div className="font-semibold">{t.label}</div>
            <div className="text-sm text-muted-foreground mt-1">{t.description}</div>
          </button>
        ))}
      </div>
      <button onClick={save} disabled={saving || picked === current} className={primaryBtn}>
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Apply template"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-primary shadow-[0_0_25px_rgba(124,58,237,0.3)] hover:shadow-[0_0_45px_rgba(124,58,237,0.5)] disabled:opacity-70";

const dangerBtn =
  "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/10";
