import { Router, type IRouter, type Response } from "express";
import { and, asc, eq } from "drizzle-orm";
import { db, projectsTable, projectInputSchema } from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../lib/auth";

const router: IRouter = Router();

router.get("/projects", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const items = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.userId, req.user!.sub))
      .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.createdAt));
    res.json({ ok: true, projects: items });
  } catch (err) {
    req.log.error({ err }, "list projects failed");
    res.status(500).json({ ok: false, error: "Failed to list projects" });
  }
});

router.post("/projects", requireAuth, async (req: AuthedRequest, res: Response) => {
  const parsed = projectInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  try {
    const [project] = await db
      .insert(projectsTable)
      .values({ ...parsed.data, userId: req.user!.sub })
      .returning();
    res.status(201).json({ ok: true, project });
  } catch (err) {
    req.log.error({ err }, "create project failed");
    res.status(500).json({ ok: false, error: "Failed to create project" });
  }
});

router.put("/projects/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  const parsed = projectInputSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const id = String(req.params["id"] ?? "");
  try {
    const [project] = await db
      .update(projectsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, req.user!.sub)))
      .returning();
    if (!project) {
      res.status(404).json({ ok: false, error: "Project not found" });
      return;
    }
    res.json({ ok: true, project });
  } catch (err) {
    req.log.error({ err }, "update project failed");
    res.status(500).json({ ok: false, error: "Failed to update project" });
  }
});

router.delete("/projects/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  const id = String(req.params["id"] ?? "");
  try {
    const [deleted] = await db
      .delete(projectsTable)
      .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, req.user!.sub)))
      .returning({ id: projectsTable.id });
    if (!deleted) {
      res.status(404).json({ ok: false, error: "Project not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "delete project failed");
    res.status(500).json({ ok: false, error: "Failed to delete project" });
  }
});

export default router;
