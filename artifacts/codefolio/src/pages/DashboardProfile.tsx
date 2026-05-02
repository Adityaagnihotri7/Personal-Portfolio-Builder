import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetMe,
  useUpdateMe,
  useListTemplates,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { SiGithub } from "react-icons/si";
import { Linkedin, Twitter, Globe, Mail, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().max(120),
  bio: z.string().max(500),
  location: z.string().max(100),
  avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  resumeUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  templateId: z.string(),
  github: z.string().url("Must be a valid URL").or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").or(z.literal("")),
  twitter: z.string().url("Must be a valid URL").or(z.literal("")),
  website: z.string().url("Must be a valid URL").or(z.literal("")),
  contactEmail: z.string().email("Must be a valid email").or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function DashboardProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: meData, isLoading } = useGetMe();
  const { data: templates } = useListTemplates();
  const updateMe = useUpdateMe();

  const user = meData?.user;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", headline: "", bio: "", location: "",
      avatarUrl: "", resumeUrl: "", templateId: "neon",
      github: "", linkedin: "", twitter: "", website: "", contactEmail: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        headline: user.headline || "",
        bio: user.bio || "",
        location: user.location || "",
        avatarUrl: user.avatarUrl || "",
        resumeUrl: user.resumeUrl || "",
        templateId: user.templateId || "neon",
        github: user.socialLinks?.github || "",
        linkedin: user.socialLinks?.linkedin || "",
        twitter: user.socialLinks?.twitter || "",
        website: user.socialLinks?.website || "",
        contactEmail: user.socialLinks?.email || "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: FormValues) {
    try {
      await updateMe.mutateAsync({
        data: {
          name: values.name,
          headline: values.headline,
          bio: values.bio,
          location: values.location,
          avatarUrl: values.avatarUrl,
          resumeUrl: values.resumeUrl,
          templateId: values.templateId,
          socialLinks: {
            github: values.github,
            linkedin: values.linkedin,
            twitter: values.twitter,
            website: values.website,
            email: values.contactEmail,
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Profile saved", description: "Your portfolio has been updated." });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save profile", variant: "destructive" });
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
          <p className="text-muted-foreground mb-6">This information appears on your public portfolio.</p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Jane Smith" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="headline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl><Input placeholder="Full-Stack Developer · React · Node" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl><Textarea placeholder="A short description about yourself..." rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Location</FormLabel>
                      <FormControl><Input placeholder="San Francisco, CA" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avatar & Resume</CardTitle>
                <CardDescription>Paste direct URLs to your avatar image and resume PDF.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                    {field.value && (
                      <div className="mt-2">
                        <img src={field.value} alt="Avatar preview" className="h-14 w-14 rounded-full object-cover border border-border" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      </div>
                    )}
                  </FormItem>
                )} />
                <FormField control={form.control} name="resumeUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume URL (PDF)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="https://..." className="flex-1" {...field} />
                        {field.value && (
                          <a href={field.value} target="_blank" rel="noopener noreferrer">
                            <Button type="button" variant="outline" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                          </a>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "github" as const, label: "GitHub", icon: SiGithub, placeholder: "https://github.com/username" },
                  { name: "linkedin" as const, label: "LinkedIn", icon: SiLinkedin, placeholder: "https://linkedin.com/in/username" },
                  { name: "twitter" as const, label: "X / Twitter", icon: SiX, placeholder: "https://twitter.com/username" },
                  { name: "website" as const, label: "Website", icon: Globe, placeholder: "https://yoursite.com" },
                  { name: "contactEmail" as const, label: "Contact Email", icon: Mail, placeholder: "hello@example.com" },
                ].map(({ name, label, icon: Icon, placeholder }) => (
                  <FormField key={name} control={form.control} name={name} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /> {label}</FormLabel>
                      <FormControl><Input placeholder={placeholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
              </CardContent>
            </Card>

            {/* Template selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Portfolio Template</CardTitle>
                <CardDescription>Choose a theme for your public portfolio.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(templates || []).map((tmpl) => {
                    const selected = form.watch("templateId") === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => form.setValue("templateId", tmpl.id)}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                      >
                        <div
                          className="h-16 rounded-lg mb-3"
                          style={{ background: tmpl.previewBackground }}
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{tmpl.name}</span>
                          {tmpl.isPro && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                          {selected && <Badge className="text-xs ml-auto">Selected</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{tmpl.description}</p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={updateMe.isPending}>
              {updateMe.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
