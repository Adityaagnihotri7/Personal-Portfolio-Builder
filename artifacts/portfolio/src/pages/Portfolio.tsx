import { useEffect, useState } from "react";
import { Link } from "wouter";
import { api, ApiError } from "@/lib/api";
import { pickTemplate } from "@/templates";
import type { PortfolioData } from "@/lib/types";

export function Portfolio({ username }: { username: string }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);
    api
      .getPublicPortfolio(username)
      .then((res) => {
        if (cancelled) return;
        setData({ user: res.user, projects: res.projects, skills: res.skills });
        document.title = `${res.user.name} · ${res.user.role}`;
        const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        if (meta && res.user.bio) meta.content = res.user.bio;
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("not_found");
        } else {
          setError(err instanceof Error ? err.message : "Failed to load portfolio");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Loading portfolio…
        </div>
      </div>
    );
  }

  if (error === "not_found") {
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">@{username}</span> isn't on CodeFolio yet
          </h1>
          <p className="text-muted-foreground">
            Want this handle? Sign up and grab it before someone else does.
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 rounded-xl font-medium text-white bg-gradient-primary shadow-[0_0_30px_rgba(124,58,237,0.35)]"
          >
            Claim @{username}
          </Link>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">{error ?? "Something went wrong."}</p>
      </div>
    );
  }

  const Template = pickTemplate(data.user.templateId);
  return <Template data={data} />;
}
