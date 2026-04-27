import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const SECRET = process.env["JWT_SECRET"] || "dev-only-insecure-secret-change-me";
const TOKEN_TTL = "7d";

export type AuthPayload = { sub: string; username: string };

export interface AuthedRequest extends Request {
  user?: AuthPayload;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload & AuthPayload;
    if (typeof decoded.sub === "string" && typeof decoded.username === "string") {
      return { sub: decoded.sub, username: decoded.username };
    }
    return null;
  } catch {
    return null;
  }
}

function readToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[
    "codefolio_token"
  ];
  return cookieToken ?? null;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = readToken(req);
  if (!token) {
    res.status(401).json({ ok: false, error: "Authentication required" });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ ok: false, error: "Invalid or expired token" });
    return;
  }
  req.user = payload;
  next();
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const token = readToken(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload) req.user = payload;
  }
  next();
}
