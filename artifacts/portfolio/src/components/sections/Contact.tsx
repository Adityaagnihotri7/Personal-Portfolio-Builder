import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, type FormEvent } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: FormState = { name: "", email: "", message: "" };

export function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Please enter a valid email.";
    if (form.message.trim().length < 5) return "Please write a slightly longer message.";
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast({ title: "Check your details", description: error, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to send your message.");
      }

      toast({
        title: "Message sent",
        description: "Thanks for reaching out — I'll get back to you soon.",
      });
      setForm(initialState);
    } catch (err) {
      const description =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or email me directly.";
      toast({ title: "Couldn't send message", description, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Get In Touch</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-primary rounded-full" />
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <motion.div
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            I'm currently available for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="space-y-4">
            <GlassCard className="p-4 flex items-center gap-4 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]" hoverScale={false}>
              <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Mail className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground font-medium">Email</p>
                <a
                  href="mailto:adityadagnihotri7@gmail.com"
                  className="text-foreground font-semibold hover:text-primary transition-colors break-all"
                >
                  adityadagnihotri7@gmail.com
                </a>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-4 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]" hoverScale={false}>
              <div className="p-3 rounded-xl bg-accent/10 text-accent border border-accent/20">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Phone</p>
                <a
                  href="tel:+918217785285"
                  className="text-foreground font-semibold hover:text-accent transition-colors"
                >
                  +91 8217785285
                </a>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-4 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]" hoverScale={false}>
              <div className="p-3 rounded-xl bg-white/5 text-foreground border border-white/10">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Location</p>
                <p className="text-foreground font-semibold">India</p>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard className="p-8" hoverScale={false}>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50 disabled:opacity-60"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50 disabled:opacity-60"
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                  rows={5}
                  disabled={isSubmitting}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all resize-none placeholder:text-muted-foreground/50 disabled:opacity-60"
                  placeholder="Hello Aditya, I'd like to discuss a project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative px-8 py-4 rounded-xl font-medium text-white overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.25)] transition-shadow hover:shadow-[0_0_60px_rgba(124,58,237,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-primary" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
