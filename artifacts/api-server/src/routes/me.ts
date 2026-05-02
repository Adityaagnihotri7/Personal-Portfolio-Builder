import { Router, type IRouter } from "express";
import { eq, and, count } from "drizzle-orm";
import { db, usersTable, projectsTable, skillsTable } from "@workspace/db";
import {
  GetMeResponse,
  OnboardMeBody,
  UpdateMeBody,
  UpdateMeResponse,
  GetMyStatsResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { findUserByClerkId } from "../lib/users";

const router: IRouter = Router();

router.get("/me", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = req.clerkUserId!;
  console.log("[GET /api/me] clerkUserId:", clerkUserId);

  const user = await findUserByClerkId(clerkUserId);
  if (!user) {
    console.log("[GET /api/me] No user found → needsOnboarding: true");
    res.json(GetMeResponse.parse({ user: null, needsOnboarding: true }));
    return;
  }
  console.log("[GET /api/me] Found user:", user.username, "| id:", user.id);
  res.json(GetMeResponse.parse({ user, needsOnboarding: false }));
});

router.post("/me/onboard", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = req.clerkUserId!;
  console.log("[POST /api/me/onboard] clerkUserId:", clerkUserId);
  console.log("[POST /api/me/onboard] body:", req.body);

  const parsed = OnboardMeBody.safeParse(req.body);
  if (!parsed.success) {
    console.error("[POST /api/me/onboard] Validation error:", parsed.error.message);
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await findUserByClerkId(clerkUserId);
  if (existing) {
    console.log("[POST /api/me/onboard] User already exists:", existing.username);
    res.status(200).json(existing);
    return;
  }

  const username = parsed.data.username.toLowerCase();

  const [taken] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, username));
  if (taken) {
    console.warn("[POST /api/me/onboard] Username already taken:", username);
    res.status(409).json({ error: "Username already taken. Please choose another." });
    return;
  }

  const [user] = await db
    .insert(usersTable)
    .values({
      clerkUserId,
      username,
      name: parsed.data.name,
      email: parsed.data.email,
      headline: "Developer",
    })
    .returning();

  console.log("[POST /api/me/onboard] User created:", user.username, "| id:", user.id);
  res.status(201).json(user);
});

router.put("/me", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = req.clerkUserId!;
  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existing = await findUserByClerkId(clerkUserId);
  if (!existing) {
    res.status(404).json({ error: "User not found, complete onboarding first" });
    return;
  }
  const [user] = await db
    .update(usersTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(usersTable.clerkUserId, clerkUserId))
    .returning();
  res.json(UpdateMeResponse.parse(user));
});

router.get("/me/stats", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = req.clerkUserId!;
  const user = await findUserByClerkId(clerkUserId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const [{ projectsCount }] = await db
    .select({ projectsCount: count() })
    .from(projectsTable)
    .where(eq(projectsTable.userId, user.id));
  const [{ skillsCount }] = await db
    .select({ skillsCount: count() })
    .from(skillsTable)
    .where(eq(skillsTable.userId, user.id));

  const fields = [
    user.name,
    user.bio,
    user.headline,
    user.location,
    user.avatarUrl,
    user.socialLinks?.github || user.socialLinks?.linkedin,
  ];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round(
    ((filled + Math.min(projectsCount, 1) + Math.min(skillsCount, 1)) /
      (fields.length + 2)) *
      100,
  );

  res.json(
    GetMyStatsResponse.parse({
      projectsCount,
      skillsCount,
      completion,
      publicUrl: `/${user.username}`,
    }),
  );
});

export default router;
