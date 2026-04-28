import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      clerkUserId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const clerkUserId = (auth?.sessionClaims as { userId?: string } | undefined)?.userId
    ?? auth?.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.clerkUserId = clerkUserId;
  next();
}
