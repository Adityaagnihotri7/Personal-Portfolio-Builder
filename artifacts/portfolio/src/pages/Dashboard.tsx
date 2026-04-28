import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { useClerk } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
  User as UserIcon,
  FolderKanban,
  Sparkles,
  Wrench,
  Palette,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  useGetMe,
  useUpdateMe,
  useGetMyStats,
  useListMyProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useListMySkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
  useListTemplates,
  getGetMeQueryKey,
  getGetMyStatsQueryKey,
  getListMyProjectsQueryKey,
  getListMySkillsQueryKey,
  getGetPublicProfileQueryKey,
} from "@/lib/api";
import { TEMPLATES, type TemplateId } from "@/templates";
import type { PortfolioData, Project, Skill } from "@/lib/portfolioTypes";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const TABS = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "template", label: "Template", icon: Palette },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function Dashboard() {
  const params = useParams<{ tab?: string }>();
  const [, setLocation] = useLocation();
  const tab: TabId = (TABS.find((t) => t.id === params.tab)?.id ?? "profile") as TabId;

  const { signOut } = useClerk();
  const { data: meData, isLoading } = useGetMe();
  const enabled = !!meData?.user;
  const { data: stats } = useGetMyStats({
    query: { enabled, queryKey: getGetMyStatsQueryKey() },
  });
  const { data: projects } = useListMyProjects({
    query: { enabled, queryKey: getListMyProjectsQueryKey() },
  });
  const { data: skills } = useListMySkills({
    query: { enabled, queryKey: getListMySkillsQueryKey() },
  });

  useEffect(() => {
    if (!isLoading && meData && !meData.user) {
      setLocation("/onboard");
    }
  }, [meData, isLoading, setLocation]);

  if (isLoading || !meData?.user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-slate-950 text-slate-300">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const user = meData.user;

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100">
      <Helmet>
        <title>Dashboard · CodeFolio</title>
      </Helmet>

      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-sm font-bold"
          >
            <span className="rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 px-1.5 py-0.5 text-slate-950">
              {"</>"}
            </span>
            <span>CodeFolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={`${basePath}/${user.username}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 text-sm text-slate-400 hover:text-cyan-300 sm:inline-flex"
              data-testid="link-public-portfolio"
            >
              View public · /{user.username} <ExternalLink className="h-3 w-3" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-slate-800"
              onClick={() => signOut({ redirectUrl: basePath || "/" })}
              data-testid="button-sign-out"
            >
              <LogOut className="mr-1 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-3">
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 font-bold text-slate-950">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-slate-400">@{user.username}</p>
              </div>
              {user.isPro && (
                <Badge className="bg-amber-500/15 text-amber-300">Pro</Badge>
              )}
            </div>
            {stats && (
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Profile completion</span>
                  <span data-testid="text-completion">{stats.completion}%</span>
                </div>
                <Progress value={stats.completion} className="h-1.5" />
              </div>
            )}
          </div>

          <nav className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/dashboard/${t.id}`}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-gradient-to-r from-cyan-400/10 to-violet-500/10 text-cyan-300"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                  data-testid={`tab-${t.id}`}
                >
                  <Icon className="h-4 w-4" /> {t.label}
                </Link>
              );
            })}
          </nav>

          {!user.isPro && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm">
              <div className="mb-1 inline-flex items-center gap-1 font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" /> Go Pro
              </div>
              <p className="text-xs text-amber-200/80">
                Unlock the Pro badge and future premium templates.
              </p>
              <ProUpgradeButton />
            </div>
          )}
        </aside>

        {/* Content */}
        <main>
          {tab === "profile" && <ProfileTab user={user} />}
          {tab === "projects" && (
            <ProjectsTab projects={projects ?? []} username={user.username} />
          )}
          {tab === "skills" && (
            <SkillsTab skills={skills ?? []} username={user.username} />
          )}
          {tab === "template" && (
            <TemplateTab
              templateId={user.templateId as TemplateId}
              previewData={{
                user,
                projects: projects ?? [],
                skills: skills ?? [],
              }}
              username={user.username}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function ProUpgradeButton() {
  const updateMe = useUpdateMe();
  const { toast } = useToast();
  const qc = useQueryClient();
  const onUpgrade = async () => {
    try {
      await updateMe.mutateAsync({ data: { isPro: true } });
      qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Welcome to Pro!", description: "Pro badge unlocked." });
    } catch {
      toast({ title: "Upgrade failed", variant: "destructive" });
    }
  };
  return (
    <Button
      size="sm"
      className="mt-3 w-full bg-amber-500/20 text-amber-200 hover:bg-amber-500/30"
      onClick={onUpgrade}
      disabled={updateMe.isPending}
      data-testid="button-upgrade-pro"
    >
      {updateMe.isPending ? (
        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
      ) : (
        <Sparkles className="mr-1 h-3.5 w-3.5" />
      )}
      Activate Pro (demo)
    </Button>
  );
}

/* -------------------- Profile Tab -------------------- */
function ProfileTab({ user }: { user: PortfolioData["user"] }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const updateMe = useUpdateMe();
  const [form, setForm] = useState({
    name: user.name,
    headline: user.headline,
    bio: user.bio,
    location: user.location,
    avatarUrl: user.avatarUrl,
    resumeUrl: user.resumeUrl,
    socialLinks: { ...(user.socialLinks ?? {}) },
  });

  useEffect(() => {
    setForm({
      name: user.name,
      headline: user.headline,
      bio: user.bio,
      location: user.location,
      avatarUrl: user.avatarUrl,
      resumeUrl: user.resumeUrl,
      socialLinks: { ...(user.socialLinks ?? {}) },
    });
  }, [user]);

  const submit = async () => {
    try {
      await updateMe.mutateAsync({ data: form });
      qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
      qc.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
      qc.invalidateQueries({
        queryKey: getGetPublicProfileQueryKey(user.username),
      });
      toast({ title: "Profile saved" });
    } catch (e) {
      toast({
        title: "Failed to save",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <SectionHeader title="Your profile" subtitle="What visitors see at the top of your portfolio." />
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Display name">
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            data-testid="input-profile-name"
          />
        </Field>
        <Field label="Headline">
          <Input
            placeholder="Full-stack developer · DevOps · Designer"
            value={form.headline}
            onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
            data-testid="input-profile-headline"
          />
        </Field>
        <Field label="Location">
          <Input
            placeholder="Bengaluru, India"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            data-testid="input-profile-location"
          />
        </Field>
        <Field label="Avatar URL">
          <Input
            placeholder="https://…"
            value={form.avatarUrl}
            onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
            data-testid="input-profile-avatar"
          />
        </Field>
        <Field label="Resume URL">
          <Input
            placeholder="https://…/resume.pdf"
            value={form.resumeUrl}
            onChange={(e) => setForm((f) => ({ ...f, resumeUrl: e.target.value }))}
            data-testid="input-profile-resume"
          />
        </Field>
        <Field label="GitHub">
          <Input
            placeholder="https://github.com/you"
            value={form.socialLinks.github ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                socialLinks: { ...f.socialLinks, github: e.target.value },
              }))
            }
            data-testid="input-profile-github"
          />
        </Field>
        <Field label="LinkedIn">
          <Input
            placeholder="https://linkedin.com/in/you"
            value={form.socialLinks.linkedin ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                socialLinks: { ...f.socialLinks, linkedin: e.target.value },
              }))
            }
            data-testid="input-profile-linkedin"
          />
        </Field>
        <Field label="Twitter">
          <Input
            placeholder="https://twitter.com/you"
            value={form.socialLinks.twitter ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                socialLinks: { ...f.socialLinks, twitter: e.target.value },
              }))
            }
            data-testid="input-profile-twitter"
          />
        </Field>
        <Field label="Website">
          <Input
            placeholder="https://you.dev"
            value={form.socialLinks.website ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                socialLinks: { ...f.socialLinks, website: e.target.value },
              }))
            }
            data-testid="input-profile-website"
          />
        </Field>
      </div>
      <Field label="Short bio">
        <Textarea
          rows={4}
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          data-testid="input-profile-bio"
        />
      </Field>

      <div className="flex justify-end">
        <Button
          onClick={submit}
          disabled={updateMe.isPending}
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
          data-testid="button-save-profile"
        >
          {updateMe.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save profile
        </Button>
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </Label>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

/* -------------------- Projects Tab -------------------- */
function ProjectsTab({
  projects,
  username,
}: {
  projects: Project[];
  username: string;
}) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const create = useCreateProject();

  const onAdd = async () => {
    try {
      await create.mutateAsync({
        data: {
          title: "New project",
          description: "",
          techStack: [],
          githubLink: "",
          liveLink: "",
          imageUrl: "",
        },
      });
      qc.invalidateQueries({ queryKey: getListMyProjectsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetPublicProfileQueryKey(username) });
    } catch {
      toast({ title: "Failed to add project", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between">
        <SectionHeader title="Projects" subtitle="Showcase your best work." />
        <Button
          onClick={onAdd}
          disabled={create.isPending}
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
          data-testid="button-add-project"
        >
          <Plus className="mr-1 h-4 w-4" /> Add project
        </Button>
      </div>
      <div className="space-y-4">
        {projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center text-slate-500">
            No projects yet — click "Add project" to get started.
          </div>
        )}
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} username={username} />
        ))}
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, username }: { project: Project; username: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const update = useUpdateProject();
  const del = useDeleteProject();
  const [form, setForm] = useState(() => ({
    title: project.title,
    description: project.description,
    techStack: project.techStack.join(", "),
    githubLink: project.githubLink,
    liveLink: project.liveLink,
    imageUrl: project.imageUrl,
  }));

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListMyProjectsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetPublicProfileQueryKey(username) });
  };

  const onSave = async () => {
    try {
      await update.mutateAsync({
        id: project.id,
        data: {
          title: form.title.trim() || "Untitled",
          description: form.description,
          techStack: form.techStack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          githubLink: form.githubLink,
          liveLink: form.liveLink,
          imageUrl: form.imageUrl,
        },
      });
      invalidate();
      toast({ title: "Project saved" });
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    }
  };

  const onDelete = async () => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    try {
      await del.mutateAsync({ id: project.id });
      invalidate();
      toast({ title: "Project deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div
      className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5"
      data-testid={`card-project-${project.id}`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            data-testid={`input-project-title-${project.id}`}
          />
        </Field>
        <Field label="Tech stack (comma separated)">
          <Input
            value={form.techStack}
            onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
            placeholder="React, TypeScript, Node"
            data-testid={`input-project-stack-${project.id}`}
          />
        </Field>
        <Field label="GitHub link">
          <Input
            value={form.githubLink}
            onChange={(e) => setForm((f) => ({ ...f, githubLink: e.target.value }))}
            data-testid={`input-project-github-${project.id}`}
          />
        </Field>
        <Field label="Live link">
          <Input
            value={form.liveLink}
            onChange={(e) => setForm((f) => ({ ...f, liveLink: e.target.value }))}
            data-testid={`input-project-live-${project.id}`}
          />
        </Field>
        <Field label="Image URL">
          <Input
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            data-testid={`input-project-image-${project.id}`}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Description">
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            data-testid={`input-project-desc-${project.id}`}
          />
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          data-testid={`button-delete-project-${project.id}`}
          disabled={del.isPending}
        >
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={update.isPending}
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
          data-testid={`button-save-project-${project.id}`}
        >
          {update.isPending ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1 h-4 w-4" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}

/* -------------------- Skills Tab -------------------- */
function SkillsTab({ skills, username }: { skills: Skill[]; username: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const create = useCreateSkill();

  const onAdd = async () => {
    try {
      await create.mutateAsync({
        data: { category: "New category", items: [] },
      });
      qc.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetPublicProfileQueryKey(username) });
    } catch {
      toast({ title: "Failed to add skill", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between">
        <SectionHeader title="Skills" subtitle="Group your skills by category." />
        <Button
          onClick={onAdd}
          disabled={create.isPending}
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
          data-testid="button-add-skill"
        >
          <Plus className="mr-1 h-4 w-4" /> Add group
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {skills.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-800 p-10 text-center text-slate-500">
            No skill groups yet — click "Add group" to get started.
          </div>
        )}
        {skills.map((s) => (
          <SkillCard key={s.id} skill={s} username={username} />
        ))}
      </div>
    </motion.div>
  );
}

function SkillCard({ skill, username }: { skill: Skill; username: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const update = useUpdateSkill();
  const del = useDeleteSkill();
  const [form, setForm] = useState(() => ({
    category: skill.category,
    items: skill.items.join(", "),
  }));

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetPublicProfileQueryKey(username) });
  };

  const onSave = async () => {
    try {
      await update.mutateAsync({
        id: skill.id,
        data: {
          category: form.category.trim() || "Untitled",
          items: form.items
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      });
      invalidate();
      toast({ title: "Skill group saved" });
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    }
  };

  const onDelete = async () => {
    if (!confirm(`Delete "${skill.category}"?`)) return;
    try {
      await del.mutateAsync({ id: skill.id });
      invalidate();
      toast({ title: "Group deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div
      className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5"
      data-testid={`card-skill-${skill.id}`}
    >
      <Field label="Category">
        <Input
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          data-testid={`input-skill-cat-${skill.id}`}
        />
      </Field>
      <div className="mt-4">
        <Field label="Skills (comma separated)">
          <Textarea
            rows={2}
            value={form.items}
            placeholder="JavaScript, TypeScript, React"
            onChange={(e) => setForm((f) => ({ ...f, items: e.target.value }))}
            data-testid={`input-skill-items-${skill.id}`}
          />
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          data-testid={`button-delete-skill-${skill.id}`}
          disabled={del.isPending}
        >
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={update.isPending}
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
          data-testid={`button-save-skill-${skill.id}`}
        >
          {update.isPending ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1 h-4 w-4" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}

/* -------------------- Template Tab -------------------- */
function TemplateTab({
  templateId,
  previewData,
  username,
}: {
  templateId: TemplateId;
  previewData: PortfolioData;
  username: string;
}) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const updateMe = useUpdateMe();
  const { data: templates } = useListTemplates();
  const [selected, setSelected] = useState<TemplateId>(templateId);
  const Preview = useMemo(() => TEMPLATES[selected].Component, [selected]);

  const apply = async () => {
    try {
      await updateMe.mutateAsync({ data: { templateId: selected } });
      qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
      qc.invalidateQueries({ queryKey: getGetPublicProfileQueryKey(username) });
      toast({ title: "Template updated", description: TEMPLATES[selected].name });
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Template"
        subtitle="Choose how your portfolio looks. Live preview below."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {(templates ?? Object.values(TEMPLATES)).map((t) => {
          const id = t.id as TemplateId;
          const active = selected === id;
          return (
            <button
              key={t.id}
              onClick={() => setSelected(id)}
              className={`group rounded-2xl border p-1 text-left transition-all ${
                active
                  ? "border-cyan-400/60 shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]"
                  : "border-slate-800/60 hover:border-slate-700"
              }`}
              data-testid={`button-template-${t.id}`}
            >
              <div
                className="flex h-32 items-center justify-center rounded-xl text-xl font-semibold"
                style={{
                  background: t.previewBackground,
                  color: t.accentColor,
                }}
              >
                {t.name}
              </div>
              <div className="flex items-center justify-between p-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {t.name}
                    {t.isPro && (
                      <Badge className="bg-amber-500/15 text-amber-300">
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{t.description}</p>
                </div>
                {active && (
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Currently active: <span className="text-slate-200">{TEMPLATES[templateId].name}</span>
        </p>
        <Button
          onClick={apply}
          disabled={updateMe.isPending || selected === templateId}
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
          data-testid="button-apply-template"
        >
          {updateMe.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Eye className="mr-2 h-4 w-4" />
          )}
          Apply template
        </Button>
      </div>

      <div>
        <SectionHeader title="Live preview" />
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800/60">
          <div className="relative h-[640px] overflow-y-auto">
            <Preview data={previewData} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
