import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Layers, Globe, Zap, Github } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const BASE = import.meta.env.BASE_URL;

export function Landing() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] left-[10%] w-[60%] h-[60%] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[140px]" />
      </div>

      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center font-bold text-white">
            C
          </div>
          <span className="text-lg font-bold">CodeFolio</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-primary text-white shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_50px_rgba(124,58,237,0.55)] transition-shadow"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 md:pt-24 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Now in beta
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Your developer portfolio.</span>
            <br />
            Live in 60 seconds.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            CodeFolio is the SaaS for engineers who want a stunning portfolio without writing a
            single line of CSS. Pick a template, add your projects, share your link.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="px-7 py-3.5 rounded-xl font-medium text-white bg-gradient-primary shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] transition-shadow"
            >
              Create your portfolio
            </Link>
            <Link
              href="/aditya"
              className="px-7 py-3.5 rounded-xl font-medium glass border border-white/10 hover:border-white/20 inline-flex items-center gap-2"
            >
              See a live example <Globe className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Free during beta · No credit card · Your link looks like{" "}
            <code className="text-foreground">{`${location.host}${BASE}your-name`}</code>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {[
            {
              icon: Layers,
              title: "Multiple templates",
              body: "Switch between Neon Dark and Minimal Light with one click. More templates coming.",
            },
            {
              icon: Zap,
              title: "Live preview",
              body: "Edit projects, skills, and bio in a CMS dashboard with a live side-by-side preview.",
            },
            {
              icon: Globe,
              title: "Public profile URL",
              body: "Every account gets a clean URL — codefolio.com/your-handle — ready to share.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <GlassCard className="h-full" hoverScale={false}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-white/10 inline-flex">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mt-4">{f.title}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">{f.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="text-sm text-muted-foreground">
            Built by developers, for developers ·{" "}
            <a
              href="https://github.com/AnmolMathad15"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
