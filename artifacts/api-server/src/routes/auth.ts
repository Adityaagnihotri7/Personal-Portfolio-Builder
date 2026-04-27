import { Router, type IRouter, type Response } from "express";
import { eq, or } from "drizzle-orm";
import {
  db,
  usersTable,
  registerUserSchema,
  loginUserSchema,
  toPublicUser,
} from "@workspace/db";
import {
  hashPassword,
  verifyPassword,
  signToken,
  requireAuth,
  type AuthedRequest,
} from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/register", async (req, res) => {
  const parsed = registerUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const { name, email, username, password } = parsed.data;
  const lowerEmail = email.toLowerCase();
  const lowerUsername = username.toLowerCase();

  try {
    const existing = await db
      .select({ id: usersTable.id, email: usersTable.email, username: usersTable.username })
      .from(usersTable)
      .where(or(eq(usersTable.email, lowerEmail), eq(usersTable.username, lowerUsername)))
      .limit(1);

    if (existing.length > 0) {
      const conflict =
        existing[0]!.email === lowerEmail ? "Email already registered" : "Username already taken";
      res.status(409).json({ ok: false, error: conflict });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        email: lowerEmail,
        username: lowerUsername,
        passwordHash,
      })
      .returning();

    const token = signToken({ sub: user!.id, username: user!.username });
    res.status(201).json({ ok: true, token, user: toPublicUser(user!, true) });
  } catch (err) {
    req.log.error({ err }, "register failed");
    res.status(500).json({ ok: false, error: "Failed to create account" });
  }
});

router.post("/auth/login", async (req, res) => {
  const parsed = loginUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Invalid email or password" });
    return;
  }
  const { email, password } = parsed.data;
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      res.status(401).json({ ok: false, error: "Invalid email or password" });
      return;
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ ok: false, error: "Invalid email or password" });
      return;
    }
    const token = signToken({ sub: user.id, username: user.username });
    res.json({ ok: true, token, user: toPublicUser(user, true) });
  } catch (err) {
    req.log.error({ err }, "login failed");
    res.status(500).json({ ok: false, error: "Login failed" });
  }
});

router.get("/auth/me", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.sub))
      .limit(1);
    if (!user) {
      res.status(404).json({ ok: false, error: "User not found" });
      return;
    }
    res.json({ ok: true, user: toPublicUser(user, true) });
  } catch (err) {
    req.log.error({ err }, "me failed");
    res.status(500).json({ ok: false, error: "Failed to load profile" });
  }
});

export default router;
