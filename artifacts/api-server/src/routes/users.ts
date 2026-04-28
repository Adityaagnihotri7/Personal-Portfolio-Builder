import { Router, type IRouter } from "express";
import { eq, desc, asc } from "drizzle-orm";
import { db, usersTable, projectsTable, skillsTable } from "@workspace/db";
import {
  CheckUsernameParams,
  CheckUsernameResponse,
  GetPublicProfileParams,
  GetPublicProfileResponse,
  GetShowcaseResponse,
} from "@workspace/api-zod";

const RESERVED = new Set([
  "sign-in",
  "sign-up",
  "dashboard",
  "onboard",
  "api",
  "admin",
  "404",
  "settings",
  "logout",
  "login",
  "signup",
  "register",
]);

const router: IRouter = Router();

router.get(
  "/usernames/:username/availability",
  async (req, res): Promise<void> => {
    const params = CheckUsernameParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const username = params.data.username.toLowerCase();
    if (
      RESERVED.has(username) ||
      !/^[a-z0-9_-]{3,30}$/.test(username)
    ) {
      res.json(
        CheckUsernameResponse.parse({ username, available: false }),
      );
      return;
    }
    const [taken] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, username));
    res.json(
      CheckUsernameResponse.parse({ username, available: !taken }),
    );
  },
);

router.get("/users/:username", async (req, res): Promise<void> => {
  const params = GetPublicProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const username = params.data.username.toLowerCase();
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  if (!user) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.userId, user.id))
    .orderBy(asc(projectsTable.position), desc(projectsTable.createdAt));
  const skills = await db
    .select()
    .from(skillsTable)
    .where(eq(skillsTable.userId, user.id))
    .orderBy(asc(skillsTable.position), asc(skillsTable.category));

  res.json(
    GetPublicProfileResponse.parse({ user, projects, skills }),
  );
});

router.get("/showcase", async (_req, res): Promise<void> => {
  const users = await db
    .select({
      username: usersTable.username,
      name: usersTable.name,
      headline: usersTable.headline,
      templateId: usersTable.templateId,
      avatarUrl: usersTable.avatarUrl,
      isPro: usersTable.isPro,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.updatedAt))
    .limit(12);
  res.json(GetShowcaseResponse.parse(users));
});

export default router;
