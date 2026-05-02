import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListMyProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  getListMyProjectsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, ExternalLink, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  techStackRaw: z.string(),
  githubLink: z.string().url("Must be a valid URL").or(z.literal("")),
  liveLink: z.string().url("Must be a valid URL").or(z.literal("")),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  editProject?: any;
}

function ProjectDialog({ open, onClose, editProject }: ProjectDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: editProject
      ? {
          title: editProject.title,
          description: editProject.description || "",
          techStackRaw: (editProject.techStack || []).join(", "),
          githubLink: editProject.githubLink || "",
          liveLink: editProject.liveLink || "",
          imageUrl: editProject.imageUrl || "",
        }
      : { title: "", description: "", techStackRaw: "", githubLink: "", liveLink: "", imageUrl: "" },
  });

  async function onSubmit(values: ProjectFormValues) {
    const techStack = values.techStackRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      title: values.title,
      description: values.description,
      techStack,
      githubLink: values.githubLink,
      liveLink: values.liveLink,
      imageUrl: values.imageUrl,
    };
    try {
      if (editProject) {
        await updateProject.mutateAsync({ id: editProject.id, data: payload });
        toast({ title: "Project updated" });
      } else {
        await createProject.mutateAsync({ data: payload });
        toast({ title: "Project added" });
      }
      queryClient.invalidateQueries({ queryKey: getListMyProjectsQueryKey() });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message, variant: "destructive" });
    }
  }

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editProject ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="My Awesome Project" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="What does this project do?" rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="techStackRaw" render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack (comma-separated)</FormLabel>
                <FormControl><Input placeholder="React, TypeScript, Node.js" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="githubLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="liveLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Demo URL</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Project Image URL</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : editProject ? "Update" : "Add Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardProjects() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: projects, isLoading } = useListMyProjects();
  const deleteProject = useDeleteProject();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteProject.mutateAsync({ id: deleteId });
      queryClient.invalidateQueries({ queryKey: getListMyProjectsQueryKey() });
      toast({ title: "Project deleted" });
    } catch {
      toast({ title: "Error deleting project", variant: "destructive" });
    }
    setDeleteId(null);
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Showcase your best work.</p>
          </div>
          <Button onClick={() => { setEditProject(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Project
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : projects?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No projects yet. Add your first one.</p>
              <Button onClick={() => { setEditProject(null); setDialogOpen(true); }} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Add Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {projects?.map((project, idx) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: idx * 0.05 }}>
                  <Card className="hover:border-primary/30 transition-colors">
                    <CardContent className="py-4 flex gap-4">
                      {project.imageUrl && (
                        <img src={project.imageUrl} alt={project.title} className="h-16 w-24 rounded-lg object-cover flex-shrink-0 border border-border" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold truncate">{project.title}</p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {project.githubLink && (
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                                <Button size="icon" variant="ghost" className="h-7 w-7"><Github className="h-3.5 w-3.5" /></Button>
                              </a>
                            )}
                            {project.liveLink && (
                              <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                <Button size="icon" variant="ghost" className="h-7 w-7"><ExternalLink className="h-3.5 w-3.5" /></Button>
                              </a>
                            )}
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditProject(project); setDialogOpen(true); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(project.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        {project.description && <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{project.description}</p>}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack?.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs font-mono">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <ProjectDialog open={dialogOpen} onClose={() => setDialogOpen(false)} editProject={editProject} />

        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
