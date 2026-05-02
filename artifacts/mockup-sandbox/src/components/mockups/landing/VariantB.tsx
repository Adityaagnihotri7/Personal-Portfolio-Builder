import { Code2, ChevronRight, Zap, Terminal, Palette, ArrowUpRight } from "lucide-react";

export function VariantB() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden font-mono" style={{ background: "#09090b", color: "#f4f4f5" }}>
      {/* Grid overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,184,166,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Radial glow top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 -z-10 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(20,184,166,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur border-b"
        style={{ background: "rgba(9,9,11,0.85)", borderColor: "rgba(20,184,166,0.15)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" style={{ color: "#14b8a6" }} />
            <span className="font-bold text-base tracking-tight text-zinc-100">CodeFolio</span>
            <span
              className="ml-1 text-xs px-1.5 py-0.5 rounded font-mono"
              style={{ background: "rgba(20,184,166,0.1)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.25)" }}
            >
              v2.0
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-sm" style={{ color: "#71717a" }}>
            <a href="#" className="hover:text-zinc-100 transition-colors">features</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">templates</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">docs</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium transition-colors" style={{ color: "#71717a" }}>Sign In</button>
            <button
              className="text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #14b8a6, #06b6d4)", color: "#09090b" }}
            >
              Get Started <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-24 pb-20 px-6 text-center">
          {/* Terminal badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-10 font-mono"
            style={{
              background: "rgba(20,184,166,0.08)",
              border: "1px solid rgba(20,184,166,0.2)",
              color: "#14b8a6",
            }}
          >
            <span className="opacity-60">$</span> npx create-codefolio@latest
            <span className="h-3 w-px opacity-60" style={{ background: "#14b8a6" }} />
            <span style={{ color: "#a1a1aa" }}>ready in 2 min</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto font-sans">
            Build a portfolio that{" "}
            <br className="hidden md:block" />
            <span
              style={{
                background: "linear-gradient(90deg, #14b8a6 0%, #06b6d4 50%, #6366f1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              gets you hired.
            </span>
          </h1>

          <p className="text-base max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "#71717a" }}>
            The portfolio platform made for engineers who ship. Connect GitHub, pick a theme — 
            your portfolio is live before you finish your coffee.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <button
              className="h-12 px-7 rounded-xl text-base font-bold flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] font-sans"
              style={{
                background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                color: "#09090b",
                boxShadow: "0 0 24px rgba(20,184,166,0.3)",
              }}
            >
              Start Building Free <ChevronRight className="h-4 w-4" />
            </button>
            <button
              className="h-12 px-7 rounded-xl text-base font-medium flex items-center gap-2 transition-colors font-sans"
              style={{
                border: "1px solid rgba(20,184,166,0.2)",
                color: "#a1a1aa",
                background: "rgba(20,184,166,0.04)",
              }}
            >
              View Showcase
            </button>
          </div>

          {/* Code window mockup */}
          <div
            className="max-w-2xl mx-auto rounded-2xl overflow-hidden text-left"
            style={{
              background: "#111113",
              border: "1px solid rgba(20,184,166,0.15)",
              boxShadow: "0 0 60px rgba(20,184,166,0.08)",
            }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="h-3 w-3 rounded-full bg-red-500 opacity-70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500 opacity-70" />
              <div className="h-3 w-3 rounded-full bg-emerald-500 opacity-70" />
              <span className="ml-3 text-xs font-mono" style={{ color: "#52525b" }}>~/portfolio/config.ts</span>
            </div>
            <div className="p-5 text-xs leading-6 font-mono">
              <div><span style={{ color: "#6366f1" }}>export</span> <span style={{ color: "#14b8a6" }}>const</span> <span style={{ color: "#f4f4f5" }}>portfolio</span> <span style={{ color: "#71717a" }}>=</span> {"{"}</div>
              <div className="ml-4"><span style={{ color: "#f4f4f5" }}>name</span><span style={{ color: "#71717a" }}>:</span> <span style={{ color: "#86efac" }}>"Jane Smith"</span><span style={{ color: "#71717a" }}>,</span></div>
              <div className="ml-4"><span style={{ color: "#f4f4f5" }}>title</span><span style={{ color: "#71717a" }}>:</span> <span style={{ color: "#86efac" }}>"Full-Stack Engineer"</span><span style={{ color: "#71717a" }}>,</span></div>
              <div className="ml-4"><span style={{ color: "#f4f4f5" }}>theme</span><span style={{ color: "#71717a" }}>:</span> <span style={{ color: "#86efac" }}>"neon-dark"</span><span style={{ color: "#71717a" }}>,</span>  <span style={{ color: "#52525b" }}>// ← try "minimal"</span></div>
              <div className="ml-4"><span style={{ color: "#f4f4f5" }}>github</span><span style={{ color: "#71717a" }}>:</span> <span style={{ color: "#86efac" }}>"@janesmith"</span><span style={{ color: "#71717a" }}>,</span></div>
              <div className="ml-4"><span style={{ color: "#f4f4f5" }}>stack</span><span style={{ color: "#71717a" }}>:</span> [<span style={{ color: "#86efac" }}>"React"</span>, <span style={{ color: "#86efac" }}>"Go"</span>, <span style={{ color: "#86efac" }}>"Postgres"</span>]</div>
              <div>{"}"}<span style={{ color: "#71717a" }}>;</span></div>
              <div className="mt-3 flex items-center gap-2" style={{ color: "#52525b" }}>
                <span style={{ color: "#14b8a6" }}>✓</span> Portfolio deployed to <span style={{ color: "#06b6d4" }}>codefolio.dev/janesmith</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-5xl mx-auto">
            <p
              className="text-center text-xs uppercase tracking-widest font-semibold mb-12 font-mono"
              style={{ color: "#52525b" }}
            >
              // what you get
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Zap,
                  accent: "#f59e0b",
                  label: "01",
                  title: "Instant deploy",
                  desc: "Push to GitHub. Your portfolio rebuilds and redeploys automatically. Zero config.",
                },
                {
                  icon: Terminal,
                  accent: "#14b8a6",
                  label: "02",
                  title: "Code-native editing",
                  desc: "No drag-and-drop. Edit your config file, commit — changes are live in seconds.",
                },
                {
                  icon: Palette,
                  accent: "#6366f1",
                  label: "03",
                  title: "Hire-worthy themes",
                  desc: "Neon-dark glassmorphism or clean editorial light. Both convert hiring managers.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl transition-all hover:translate-y-[-2px]"
                  style={{
                    background: "#111113",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center"
                      style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}33` }}
                    >
                      <f.icon className="h-4.5 w-4.5" style={{ color: f.accent }} />
                    </div>
                    <span className="text-xs font-mono" style={{ color: "#3f3f46" }}>{f.label}</span>
                  </div>
                  <h3 className="font-semibold text-zinc-100 mb-2 font-sans">{f.title}</h3>
                  <p className="text-xs leading-relaxed font-sans" style={{ color: "#71717a" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-20 px-6">
          <div
            className="max-w-3xl mx-auto text-center rounded-3xl p-12"
            style={{
              background: "linear-gradient(135deg, rgba(20,184,166,0.12), rgba(99,102,241,0.12))",
              border: "1px solid rgba(20,184,166,0.2)",
              boxShadow: "0 0 60px rgba(20,184,166,0.06)",
            }}
          >
            <h2 className="text-3xl font-black text-zinc-100 mb-3 font-sans">
              Ship your portfolio tonight.
            </h2>
            <p className="text-sm mb-8 font-sans" style={{ color: "#71717a" }}>
              Free forever for individuals. No credit card required.
            </p>
            <button
              className="px-8 py-3 rounded-xl font-bold text-sm font-sans transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                color: "#09090b",
                boxShadow: "0 0 24px rgba(20,184,166,0.25)",
              }}
            >
              Start for Free →
            </button>
          </div>
        </section>
      </main>

      <footer
        className="border-t py-8"
        style={{ borderColor: "rgba(255,255,255,0.04)", background: "#09090b" }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs font-mono" style={{ color: "#52525b" }}>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4" style={{ color: "#14b8a6" }} />
            <span className="text-zinc-400 font-bold">CodeFolio</span>
          </div>
          <span>© {new Date().getFullYear()} · Made for engineers.</span>
        </div>
      </footer>
    </div>
  );
}
