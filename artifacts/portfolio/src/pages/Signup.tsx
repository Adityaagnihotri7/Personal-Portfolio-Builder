import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export function Signup() {
  const [, setLocation] = useLocation();
  const { register, user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) setLocation("/dashboard");
  }, [user, setLocation]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email.toLowerCase(),
        username: form.username.toLowerCase(),
        password: form.password,
      });
      setLocation("/dashboard");
    } catch (err) {
      toast({
        title: "Signup failed",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center px-6 py-10 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[140px]" />
        <div className="absolute bottom-[-20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[140px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md glass rounded-2xl p-8 space-y-6 border border-white/10"
      >
        <div className="space-y-2 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center font-bold text-white">
              C
            </div>
            <span className="text-lg font-bold">CodeFolio</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your portfolio</h1>
          <p className="text-sm text-muted-foreground">Pick a username — it becomes your URL.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full name</label>
            <input
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={submitting}
              className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Username</label>
            <div className="flex items-stretch rounded-xl border border-white/10 bg-background/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50">
              <span className="px-3 flex items-center text-muted-foreground text-sm">
                codefolio/
              </span>
              <input
                required
                pattern="[a-z0-9_-]+"
                title="lowercase letters, numbers, _ or -"
                autoComplete="username"
                value={form.username}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                  }))
                }
                disabled={submitting}
                className="flex-1 bg-transparent border-0 px-2 py-3 focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              disabled={submitting}
              className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password (8+ chars)</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              disabled={submitting}
              className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full relative px-6 py-3 rounded-xl font-medium text-white overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-gradient-primary" />
            <span className="relative">{submitting ? "Creating…" : "Create account"}</span>
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
