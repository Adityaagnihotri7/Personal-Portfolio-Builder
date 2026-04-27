import { Router, type IRouter, type Response } from "express";
import { asc, eq } from "drizzle-orm";
import {
  db,
  usersTable,
  projectsTable,
  skillsTable,
  updateUserSchema,
  toPublicUser,
} from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../lib/auth";

const router: IRouter = Router();

router.get("/user/:username", async (req, res) => {
  const username = req.params["username"]!.toLowerCase();
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);
    if (!user) {
      res.status(404).json({ ok: false, error: "Portfolio not found" });
      return;
    }
    const [projects, skills] = await Promise.all([
      db
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.userId, user.id))
        .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.createdAt)),
      db
        .select()
        .from(skillsTable)
        .where(eq(skillsTable.userId, user.id))
        .orderBy(asc(skillsTable.sortOrder), asc(skillsTable.createdAt)),
    ]);

    res.json({
      ok: true,
      user: toPublicUser(user, false),
      projects,
      skills,
    });
  } catch (err) {
    req.log.error({ err }, "get user failed");
    res.status(500).json({ ok: false, error: "Failed to load portfolio" });
  }
});

router.put("/user/update", requireAuth, async (req: AuthedRequest, res: Response) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  try {
    const [user] = await db
      .update(usersTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(usersTable.id, req.user!.sub))
      .returning();
    if (!user) {
      res.status(404).json({ ok: false, error: "User not found" });
      return;
    }
    res.json({ ok: true, user: toPublicUser(user, true) });
  } catch (err) {
    req.log.error({ err }, "update user failed");
    res.status(500).json({ ok: false, error: "Failed to update profile" });
  }
});

export default router;
