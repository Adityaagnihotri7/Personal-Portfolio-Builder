import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListMySkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
  getListMySkillsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const skillSchema = z.object({
  category: z.string().min(1, "Category is required"),
  itemsRaw: z.string().min(1, "Add at least one skill"),
});

type SkillFormValues = z.infer<typeof skillSchema>;

function SkillDialog({ open, onClose, editSkill }: { open: boolean; onClose: () => void; editSkill?: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: editSkill
      ? { category: editSkill.category, itemsRaw: (editSkill.items || []).join(", ") }
      : { category: "", itemsRaw: "" },
  });

  async function onSubmit(values: SkillFormValues) {
    const items = values.itemsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    try {
      if (editSkill) {
        await updateSkill.mutateAsync({ id: editSkill.id, data: { category: values.category, items } });
        toast({ title: "Skill group updated" });
      } else {
        await createSkill.mutateAsync({ data: { category: values.category, items } });
        toast({ title: "Skill group added" });
      }
      queryClient.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message, variant: "destructive" });
    }
  }

  const isPending = createSkill.isPending || updateSkill.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editSkill ? "Edit Skill Group" : "Add Skill Group"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl><Input placeholder="Frontend, Backend, DevOps, Tools..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="itemsRaw" render={({ field }) => (
              <FormItem>
                <FormLabel>Skills (comma-separated)</FormLabel>
                <FormControl><Input placeholder="React, TypeScript, Tailwind, Vite" {...field} /></FormControl>
                <FormMessage />
                {field.value && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {field.value.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs font-mono">{skill}</Badge>
                    ))}
                  </div>
                )}
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : editSkill ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardSkills() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: skills, isLoading } = useListMySkills();
  const deleteSkill = useDeleteSkill();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSkill, setEditSkill] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteSkill.mutateAsync({ id: deleteId });
      queryClient.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
      toast({ title: "Skill group deleted" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
    setDeleteId(null);
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
            <p className="text-muted-foreground">Organize your tech stack by category.</p>
          </div>
          <Button onClick={() => { setEditSkill(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : skills?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No skills defined yet. Add your first skill group.</p>
              <Button onClick={() => { setEditSkill(null); setDialogOpen(true); }} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Add Skill Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {skills?.map((skill, idx) => (
                <motion.div key={skill.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: idx * 0.05 }}>
                  <Card className="hover:border-primary/30 transition-colors">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{skill.category}</span>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditSkill(skill); setDialogOpen(true); }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(skill.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.items?.map((item) => (
                          <Badge key={item} variant="secondary" className="font-mono text-xs">{item}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <SkillDialog open={dialogOpen} onClose={() => setDialogOpen(false)} editSkill={editSkill} />

        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this skill group?</AlertDialogTitle>
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
