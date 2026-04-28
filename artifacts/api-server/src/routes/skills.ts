import { Router, type IRouter } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db, skillsTable } from "@workspace/db";
import {
  CreateSkillBody,
  UpdateSkillBody,
  UpdateSkillParams,
  DeleteSkillParams,
  ListMySkillsResponse,
  UpdateSkillResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { findUserByClerkId } from "../lib/users";

const router: IRouter = Router();

router.get("/skills", requireAuth, async (req, res): Promise<void> => {
  const user = await findUserByClerkId(req.clerkUserId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const skills = await db
    .select()
    .from(skillsTable)
    .where(eq(skillsTable.userId, user.id))
    .orderBy(asc(skillsTable.position), asc(skillsTable.category));
  res.json(ListMySkillsResponse.parse(skills));
});

router.post("/skills", requireAuth, async (req, res): Promise<void> => {
  const user = await findUserByClerkId(req.clerkUserId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [skill] = await db
    .insert(skillsTable)
    .values({ ...parsed.data, userId: user.id })
    .returning();
  res.status(201).json(skill);
});

router.put("/skills/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const user = await findUserByClerkId(req.clerkUserId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const [skill] = await db
    .update(skillsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(
      and(eq(skillsTable.id, params.data.id), eq(skillsTable.userId, user.id)),
    )
    .returning();
  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }
  res.json(UpdateSkillResponse.parse(skill));
});

router.delete("/skills/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const user = await findUserByClerkId(req.clerkUserId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const [skill] = await db
    .delete(skillsTable)
    .where(
      and(eq(skillsTable.id, params.data.id), eq(skillsTable.userId, user.id)),
    )
    .returning();
  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
