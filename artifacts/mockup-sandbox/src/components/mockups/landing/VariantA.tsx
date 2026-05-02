import { Code2, ChevronRight, Zap, Terminal, Palette, ArrowUpRight, Star } from "lucide-react";

export function VariantA() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col overflow-hidden font-sans">
      {/* Dot grid background */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d4 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CodeFolio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Templates</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-medium">Sign In</button>
            <button className="bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-1.5">
              Get Started <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-24 pb-20 text-center px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-4 py-1.5 text-sm text-zinc-600 mb-8">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Free for developers · No credit card needed
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-3xl mx-auto">
            The portfolio builder{" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              serious developers
            </span>{" "}
            actually use.
          </h1>

          <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Stop wrestling with WordPress and generic templates. CodeFolio generates a premium, 
            lightning-fast portfolio from your GitHub — in under 2 minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              className="h-12 px-7 rounded-xl text-base font-semibold text-white flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              Build My Portfolio <ChevronRight className="h-4 w-4" />
            </button>
            <button className="h-12 px-7 rounded-xl text-base font-medium text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors">
              View Live Examples
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-400">
            <div className="flex -space-x-2">
              {["bg-indigo-400", "bg-violet-400", "bg-pink-400", "bg-emerald-400"].map((c, i) => (
                <div key={i} className={`h-7 w-7 rounded-full border-2 border-white ${c}`} />
              ))}
            </div>
            <span>Joined by <strong className="text-zinc-700">2,400+</strong> developers</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1">4.9/5</span>
            </div>
          </div>
        </section>

        {/* Feature strip */}
        <section className="py-20 bg-zinc-50 border-y border-zinc-100">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-center text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-12">
              Everything you need, nothing you don't
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  color: "bg-amber-50 text-amber-600",
                  title: "Ships in minutes",
                  desc: "Connect GitHub, choose a template, and your portfolio is live before your next coffee is cold.",
                },
                {
                  icon: Terminal,
                  color: "bg-indigo-50 text-indigo-600",
                  title: "Speaks your stack",
                  desc: "Auto-parses tech stacks, renders markdown readmes, and surfaces your best work front and center.",
                },
                {
                  icon: Palette,
                  color: "bg-pink-50 text-pink-600",
                  title: "Designer-level themes",
                  desc: "Glassmorphic dark mode or clean editorial light — both crafted to impress senior hiring managers.",
                },
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all">
                  <div className={`h-10 w-10 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center px-6">
          <div
            className="max-w-3xl mx-auto rounded-3xl p-12"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #ec4899 100%)" }}
          >
            <h2 className="text-3xl font-black text-white mb-3">Your portfolio won't build itself.</h2>
            <p className="text-indigo-100 mb-8">Start for free — no credit card, no setup, no excuses.</p>
            <button className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
              Start Building Free
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-zinc-900 flex items-center justify-center">
              <Code2 className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-zinc-700">CodeFolio</span>
          </div>
          <span>© {new Date().getFullYear()} · Built for developers.</span>
        </div>
      </footer>
    </div>
  );
}
