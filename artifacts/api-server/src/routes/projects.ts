import { Router, type IRouter } from "express";
import { eq, and, desc, asc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  CreateProjectBody,
  UpdateProjectBody,
  UpdateProjectParams,
  DeleteProjectParams,
  ListMyProjectsResponse,
  UpdateProjectResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { findUserByClerkId } from "../lib/users";

const router: IRouter = Router();

router.get("/projects", requireAuth, async (req, res): Promise<void> => {
  const user = await findUserByClerkId(req.clerkUserId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.userId, user.id))
    .orderBy(asc(projectsTable.position), desc(projectsTable.createdAt));
  res.json(ListMyProjectsResponse.parse(projects));
});

router.post("/projects", requireAuth, async (req, res): Promise<void> => {
  const user = await findUserByClerkId(req.clerkUserId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db
    .insert(projectsTable)
    .values({ ...parsed.data, userId: user.id })
    .returning();
  res.status(201).json(project);
});

router.put("/projects/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const user = await findUserByClerkId(req.clerkUserId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const [project] = await db
    .update(projectsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(
      and(
        eq(projectsTable.id, params.data.id),
        eq(projectsTable.userId, user.id),
      ),
    )
    .returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(UpdateProjectResponse.parse(project));
});

router.delete("/projects/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const user = await findUserByClerkId(req.clerkUserId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const [project] = await db
    .delete(projectsTable)
    .where(
      and(
        eq(projectsTable.id, params.data.id),
        eq(projectsTable.userId, user.id),
      ),
    )
    .returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
