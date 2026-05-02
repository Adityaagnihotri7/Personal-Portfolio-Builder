import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendContactMessage } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { Globe, Mail, MapPin, ExternalLink, Download, Send, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

function ContactForm({ username }: { username: string }) {
  const { toast } = useToast();
  const sendContact = useSendContactMessage();
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: ContactValues) {
    try {
      await sendContact.mutateAsync({ data: { username, ...values } });
      toast({ title: "Message sent!", description: "The owner will get back to you." });
      form.reset();
    } catch {
      toast({ title: "Failed to send", variant: "destructive" });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Your name"
            {...form.register("name")}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-cyan-400/60"
          />
          {form.formState.errors.name && <p className="text-xs text-red-400 mt-1">{form.formState.errors.name.message}</p>}
        </div>
        <div>
          <Input
            placeholder="your@email.com"
            {...form.register("email")}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-cyan-400/60"
          />
          {form.formState.errors.email && <p className="text-xs text-red-400 mt-1">{form.formState.errors.email.message}</p>}
        </div>
      </div>
      <div>
        <Textarea
          placeholder="What's on your mind?"
          rows={4}
          {...form.register("message")}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-cyan-400/60 resize-none"
        />
        {form.formState.errors.message && <p className="text-xs text-red-400 mt-1">{form.formState.errors.message.message}</p>}
      </div>
      <Button
        type="submit"
        disabled={sendContact.isPending}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold gap-2"
      >
        <Send className="h-4 w-4" />
        {sendContact.isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
  };
}

export function NeonTemplate({ data }: { data: any }) {
  const { user, projects, skills } = data;

  const socialLinks = [
    { href: user.socialLinks?.github, icon: SiGithub, label: "GitHub" },
    { href: user.socialLinks?.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: user.socialLinks?.twitter, icon: Twitter, label: "X" },
    { href: user.socialLinks?.website, icon: Globe, label: "Website" },
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 70%, #0c4a6e 100%)", color: "#e2e8f0" }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #22d3ee, transparent)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-32">
        {/* Hero */}
        <section className="text-center">
          <motion.div {...fadeUp(0)}>
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-28 w-28 rounded-full mx-auto mb-6 object-cover border-2 shadow-lg"
                style={{ borderColor: "#22d3ee", boxShadow: "0 0 30px rgba(34,211,238,0.3)" }}
              />
            ) : (
              <div className="h-28 w-28 rounded-full mx-auto mb-6 border-2 flex items-center justify-center text-3xl font-bold" style={{ borderColor: "#22d3ee", background: "linear-gradient(135deg, #1e1b4b, #0c4a6e)", boxShadow: "0 0 30px rgba(34,211,238,0.3)" }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3" style={{ background: "linear-gradient(135deg, #22d3ee, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {user.name}
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="text-xl text-slate-300 mb-2 font-mono">{user.headline}</motion.p>
          {user.location && (
            <motion.p {...fadeUp(0.2)} className="flex items-center justify-center gap-1.5 text-sm text-slate-400 mb-6">
              <MapPin className="h-3.5 w-3.5" /> {user.location}
            </motion.p>
          )}
          <motion.div {...fadeUp(0.25)} className="flex items-center justify-center gap-3 flex-wrap">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all text-sm backdrop-blur-sm">
                <Icon className="h-4 w-4" /> {label}
              </a>
            ))}
            {user.resumeUrl && (
              <a href={user.resumeUrl} target="_blank" download>
                <Button size="sm" className="gap-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
                  <Download className="h-3.5 w-3.5" /> Resume
                </Button>
              </a>
            )}
          </motion.div>
        </section>

        {/* About */}
        {user.bio && (
          <section>
            <motion.h2 {...fadeUp(0)} className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">About</motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              {user.bio}
            </motion.p>
          </section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <section>
            <motion.h2 {...fadeUp(0)} className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-8">Skills</motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((group: any, i: number) => (
                <motion.div key={group.id} {...fadeUp(i * 0.07)}
                  className="p-5 rounded-2xl border border-white/10 backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items?.map((item: string) => (
                      <span key={item} className="px-3 py-1 rounded-full text-xs font-mono border"
                        style={{ borderColor: "rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.08)", color: "#22d3ee" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section>
            <motion.h2 {...fadeUp(0)} className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-8">Projects</motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project: any, i: number) => (
                <motion.div key={project.id} {...fadeUp(i * 0.07)}
                  className="group p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  {project.imageUrl && (
                    <img src={project.imageUrl} alt={project.title} className="h-40 w-full object-cover rounded-xl mb-4 border border-white/10" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  )}
                  <h3 className="font-bold text-lg text-white mb-2">{project.title}</h3>
                  {project.description && <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                        <SiGithub className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors ml-2">
                        <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section>
          <motion.h2 {...fadeUp(0)} className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Get In Touch</motion.h2>
          <motion.div {...fadeUp(0.1)}
            className="p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            {user.socialLinks?.email && (
              <p className="flex items-center gap-2 text-slate-400 mb-6 text-sm">
                <Mail className="h-4 w-4 text-cyan-400" />
                <a href={`mailto:${user.socialLinks.email}`} className="hover:text-cyan-400 transition-colors">{user.socialLinks.email}</a>
              </p>
            )}
            <ContactForm username={user.username} />
          </motion.div>
        </section>
      </div>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-600">
        Built with CodeFolio · /{user.username}
      </footer>
    </div>
  );
}
