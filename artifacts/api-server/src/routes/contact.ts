import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { SendContactMessageBody } from "@workspace/api-zod";
import { findUserByUsername } from "../lib/users";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SendContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const recipient = await findUserByUsername(parsed.data.username);
  if (!recipient) {
    res.status(404).json({ error: "Recipient not found" });
    return;
  }
  await db.insert(contactMessagesTable).values({
    recipientId: recipient.id,
    senderName: parsed.data.name,
    senderEmail: parsed.data.email,
    message: parsed.data.message,
  });
  req.log.info(
    { recipient: recipient.username },
    "Stored contact message",
  );
  res.status(202).json({ accepted: true });
});

export default router;
