import { Router, type IRouter } from "express";
import { ListTemplatesResponse } from "@workspace/api-zod";
import { TEMPLATES } from "../lib/templates";

const router: IRouter = Router();

router.get("/templates", async (_req, res): Promise<void> => {
  res.json(ListTemplatesResponse.parse(TEMPLATES));
});

export default router;
