import { Router, type IRouter, type Response } from "express";
import { and, asc, eq } from "drizzle-orm";
import { db, skillsTable, skillInputSchema } from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../lib/auth";

const router: IRouter = Router();

router.get("/skills", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const items = await db
      .select()
      .from(skillsTable)
      .where(eq(skillsTable.userId, req.user!.sub))
      .orderBy(asc(skillsTable.sortOrder), asc(skillsTable.createdAt));
    res.json({ ok: true, skills: items });
  } catch (err) {
    req.log.error({ err }, "list skills failed");
    res.status(500).json({ ok: false, error: "Failed to list skills" });
  }
});

router.post("/skills", requireAuth, async (req: AuthedRequest, res: Response) => {
  const parsed = skillInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  try {
    const [skill] = await db
      .insert(skillsTable)
      .values({ ...parsed.data, userId: req.user!.sub })
      .returning();
    res.status(201).json({ ok: true, skill });
  } catch (err) {
    req.log.error({ err }, "create skill failed");
    res.status(500).json({ ok: false, error: "Failed to create skill" });
  }
});

router.put("/skills/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  const parsed = skillInputSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const id = String(req.params["id"] ?? "");
  try {
    const [skill] = await db
      .update(skillsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(skillsTable.id, id), eq(skillsTable.userId, req.user!.sub)))
      .returning();
    if (!skill) {
      res.status(404).json({ ok: false, error: "Skill not found" });
      return;
    }
    res.json({ ok: true, skill });
  } catch (err) {
    req.log.error({ err }, "update skill failed");
    res.status(500).json({ ok: false, error: "Failed to update skill" });
  }
});

router.delete("/skills/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  const id = String(req.params["id"] ?? "");
  try {
    const [deleted] = await db
      .delete(skillsTable)
      .where(and(eq(skillsTable.id, id), eq(skillsTable.userId, req.user!.sub)))
      .returning({ id: skillsTable.id });
    if (!deleted) {
      res.status(404).json({ ok: false, error: "Skill not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "delete skill failed");
    res.status(500).json({ ok: false, error: "Failed to delete skill" });
  }
});

export default router;
