import { Link } from "wouter";
import { Show } from "@clerk/react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Layout, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetShowcase, useListTemplates } from "@/lib/api";

export function Landing() {
  const { data: showcase } = useGetShowcase();
  const { data: templates } = useListTemplates();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Helmet>
        <title>CodeFolio — Build a stunning developer portfolio in minutes</title>
        <meta
          name="description"
          content="CodeFolio lets developers ship a professional portfolio in minutes. Pick a template, fill in your projects, share a public URL — no code required."
        />
        <link
          rel="canonical"
          href={`${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}/`}
        />
      </Helmet>

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight"
            data-testid="link-home"
          >
            <span className="rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 px-2 py-1 text-slate-950">
              {"</>"}
            </span>
            <span>CodeFolio</span>
          </Link>
          <nav className="flex items-center gap-3">
            <a
              href="#templates"
              className="hidden text-sm text-slate-400 hover:text-slate-100 sm:block"
            >
              Templates
            </a>
            <a
              href="#showcase"
              className="hidden text-sm text-slate-400 hover:text-slate-100 sm:block"
            >
              Showcase
            </a>
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-200 hover:bg-slate-800 hover:text-white"
                  data-testid="button-sign-in"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
                  data-testid="button-get-started"
                >
                  Get started
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
                  data-testid="button-dashboard"
                >
                  Dashboard
                </Button>
              </Link>
            </Show>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20">
            <Sparkles className="mr-1 h-3 w-3" /> Now with Pro templates
          </Badge>
          <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
            Ship your{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              developer portfolio
            </span>{" "}
            in minutes.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            CodeFolio is a hosted CMS for developers. Sign up, fill in your
            projects and skills, pick a template — and your live portfolio is
            ready at a beautiful URL.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Show when="signed-out">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
                  data-testid="button-hero-cta"
                >
                  Create your portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
                  data-testid="button-hero-dashboard"
                >
                  Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Show>
            <Link href="/aditya">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800"
                data-testid="button-demo"
              >
                See live demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 sm:grid-cols-3">
        {[
          {
            icon: Layout,
            title: "Beautiful templates",
            body: "Neon Dark glassmorphism and Minimal Light editorial — pick and switch any time.",
          },
          {
            icon: Code2,
            title: "Built for devs",
            body: "Drop in projects with tech stacks, GitHub + live links, and grouped skills.",
          },
          {
            icon: ShieldCheck,
            title: "Safe contact form",
            body: "Visitors can reach you without ever seeing your email.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 backdrop-blur"
          >
            <div className="mb-3 inline-flex rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-2">
              <Icon className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{body}</p>
          </motion.div>
        ))}
      </section>

      {/* Templates */}
      <section id="templates" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-semibold tracking-tight">
          Pick your style
        </h2>
        <p className="mt-2 text-slate-400">
          Switch templates anytime from your dashboard.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {(templates ?? []).map((t) => (
            <div
              key={t.id}
              className="group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40"
              data-testid={`card-template-${t.id}`}
            >
              <div
                className="flex h-48 items-center justify-center text-2xl font-semibold"
                style={{ background: t.previewBackground, color: t.accentColor }}
              >
                {t.name}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t.name}</h3>
                  {t.isPro && (
                    <Badge className="bg-amber-500/10 text-amber-300">
                      Pro
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-semibold tracking-tight">
          Recent portfolios
        </h2>
        <p className="mt-2 text-slate-400">Built with CodeFolio.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(showcase ?? []).map((u) => (
            <Link
              key={u.username}
              href={`/${u.username}`}
              className="group rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 transition-all hover:border-cyan-400/40 hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.4)]"
              data-testid={`card-showcase-${u.username}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-slate-950">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{u.name}</p>
                    {u.isPro && (
                      <Badge className="bg-amber-500/10 text-amber-300">
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-sm text-slate-400">
                    @{u.username} · {u.headline || "Developer"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500 group-hover:text-cyan-300">
                View portfolio →
              </p>
            </Link>
          ))}
          {(!showcase || showcase.length === 0) && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-10 text-center text-slate-500">
              No portfolios yet — be the first to publish.
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-8 text-center text-sm text-slate-500">
        Built with CodeFolio · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
