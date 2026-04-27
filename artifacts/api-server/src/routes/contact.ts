import { Router, type IRouter, type Request, type Response } from "express";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { z } from "zod/v4";

const router: IRouter = Router();

const contactSchema = z.object({
  username: z.string().trim().min(1).max(60).optional(),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("Invalid email address").max(254),
  message: z.string().trim().min(5, "Message is too short").max(5000),
});

const FALLBACK_TO = "adityadagnihotri7@gmail.com";

let cachedTransporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter | null {
  const user = process.env["GMAIL_USER"];
  const pass = process.env["GMAIL_APP_PASSWORD"];
  if (!user || !pass) return null;
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return cachedTransporter;
}

router.post("/contact", async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const { name, email, message, username } = parsed.data;

  let recipient = FALLBACK_TO;
  let recipientName = "CodeFolio";
  if (username) {
    try {
      const [u] = await db
        .select({ email: usersTable.email, name: usersTable.name })
        .from(usersTable)
        .where(eq(usersTable.username, username.toLowerCase()))
        .limit(1);
      if (u) {
        recipient = u.email;
        recipientName = u.name;
      }
    } catch (err) {
      req.log.error({ err }, "lookup user for contact failed");
    }
  }

  const transporter = getTransporter();
  if (!transporter) {
    req.log.error("Email transporter not configured");
    res
      .status(503)
      .json({ ok: false, error: "Email service is not configured yet. Please try again later." });
    return;
  }

  const safe = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  try {
    await transporter.sendMail({
      from: `"CodeFolio Contact" <${process.env["GMAIL_USER"]}>`,
      to: recipient,
      replyTo: `${name} <${email}>`,
      subject: `New CodeFolio message for ${recipientName} from ${name}`,
      text: `New message from your CodeFolio contact form\n\nFrom: ${name} <${email}>\n\nMessage:\n${message}\n`,
      html: `
        <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0b0f1a;color:#e6e7eb;padding:24px;">
          <div style="max-width:560px;margin:0 auto;background:#11162a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <div style="background:linear-gradient(90deg,#7c3aed,#06b6d4);padding:18px 24px;color:#fff;font-weight:700;font-size:18px;">New CodeFolio message</div>
            <div style="padding:24px;">
              <p style="margin:0 0 12px;color:#9ca3af;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">From</p>
              <p style="margin:0 0 4px;font-size:18px;font-weight:600;">${safe(name)}</p>
              <p style="margin:0 0 24px;color:#a78bfa;">${safe(email)}</p>
              <p style="margin:0 0 12px;color:#9ca3af;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Message</p>
              <div style="white-space:pre-wrap;line-height:1.6;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px;">${safe(message)}</div>
            </div>
          </div>
        </div>
      `,
    });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "send mail failed");
    res
      .status(500)
      .json({ ok: false, error: "Failed to send your message. Please try again." });
  }
});

export default router;
