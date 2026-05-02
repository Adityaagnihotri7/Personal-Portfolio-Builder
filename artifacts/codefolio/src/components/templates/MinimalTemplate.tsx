import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendContactMessage } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { Globe, Mail, MapPin, ExternalLink, Download, ArrowUpRight, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
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
      toast({ title: "Message sent!" });
      form.reset();
    } catch {
      toast({ title: "Failed to send", variant: "destructive" });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Your name" {...form.register("name")} className="border-gray-200 focus-visible:ring-gray-900" />
        <Input placeholder="your@email.com" {...form.register("email")} className="border-gray-200 focus-visible:ring-gray-900" />
      </div>
      <Textarea placeholder="Your message..." rows={4} {...form.register("message")} className="border-gray-200 focus-visible:ring-gray-900 resize-none" />
      <Button type="submit" disabled={sendContact.isPending} className="bg-gray-900 hover:bg-gray-700 text-white">
        {sendContact.isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, delay },
  };
}

export function MinimalTemplate({ data }: { data: any }) {
  const { user, projects, skills } = data;

  const socialLinks = [
    { href: user.socialLinks?.github, icon: SiGithub, label: "GitHub" },
    { href: user.socialLinks?.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: user.socialLinks?.twitter, icon: Twitter, label: "X" },
    { href: user.socialLinks?.website, icon: Globe, label: "Website" },
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header nav */}
        <nav className="flex items-center justify-between mb-24">
          <span className="font-serif text-lg text-gray-900">{user.name}</span>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {socialLinks.slice(0, 3).map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <section className="mb-24">
          <motion.div {...fadeUp(0)} className="flex items-start gap-8 mb-12">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover flex-shrink-0 border border-gray-100" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-serif font-bold text-gray-400 flex-shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-500 text-sm mb-1">{user.headline}</p>
              {user.location && (
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" /> {user.location}
                </p>
              )}
            </div>
          </motion.div>

          {user.bio && (
            <motion.p {...fadeUp(0.1)} className="text-gray-600 text-lg leading-relaxed max-w-xl">
              {user.bio}
            </motion.p>
          )}

          {user.resumeUrl && (
            <motion.div {...fadeUp(0.15)} className="mt-8">
              <a href={user.resumeUrl} target="_blank" download>
                <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Download className="h-3.5 w-3.5" /> Download Resume
                </Button>
              </a>
            </motion.div>
          )}
        </section>

        {/* Skills */}
        {skills?.length > 0 && (
          <section className="mb-24">
            <motion.h2 {...fadeUp(0)} className="text-xs text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-100 pb-2">Skills</motion.h2>
            <div className="space-y-6">
              {skills.map((group: any, i: number) => (
                <motion.div key={group.id} {...fadeUp(i * 0.06)} className="flex gap-8">
                  <span className="w-32 flex-shrink-0 text-xs text-gray-400 pt-0.5 font-medium">{group.category}</span>
                  <div className="flex flex-wrap gap-2">
                    {group.items?.map((item: string) => (
                      <span key={item} className="px-2.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
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
          <section className="mb-24">
            <motion.h2 {...fadeUp(0)} className="text-xs text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-100 pb-2">Projects</motion.h2>
            <div className="space-y-8">
              {projects.map((project: any, i: number) => (
                <motion.div key={project.id} {...fadeUp(i * 0.06)} className="group">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-serif font-bold text-xl text-gray-900">{project.title}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                          <SiGithub className="h-4 w-4 text-gray-400 hover:text-gray-900 transition-colors" />
                        </a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                          <ArrowUpRight className="h-4 w-4 text-gray-400 hover:text-gray-900 transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && <p className="text-gray-500 text-sm leading-relaxed mb-3">{project.description}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="text-xs text-gray-400 font-mono">{tech}</span>
                    ))}
                  </div>
                  <div className="border-b border-gray-100 mt-6" />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="mb-16">
          <motion.h2 {...fadeUp(0)} className="text-xs text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-100 pb-2">Contact</motion.h2>
          {user.socialLinks?.email && (
            <motion.p {...fadeUp(0.05)} className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Mail className="h-4 w-4 text-gray-400" />
              <a href={`mailto:${user.socialLinks.email}`} className="hover:text-gray-900 underline underline-offset-2 decoration-gray-200">{user.socialLinks.email}</a>
            </motion.p>
          )}
          <motion.div {...fadeUp(0.1)}>
            <ContactForm username={user.username} />
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 pt-8 text-xs text-gray-300 text-center">
          Built with CodeFolio · /{user.username}
        </footer>
      </div>
    </div>
  );
}
