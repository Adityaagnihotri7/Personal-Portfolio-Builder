import { Router, type IRouter } from "express";
import { clerkMiddleware } from "@clerk/express";
import healthRouter from "./health";
import meRouter from "./me";
import usersRouter from "./users";
import projectsRouter from "./projects";
import skillsRouter from "./skills";
import contactRouter from "./contact";
import templatesRouter from "./templates";

const router: IRouter = Router();

// Public routes — no auth needed
router.use(healthRouter);
router.use(usersRouter);
router.use(contactRouter);
router.use(templatesRouter);

// Protected routes — require Clerk auth context
router.use(clerkMiddleware());
router.use(meRouter);
router.use(projectsRouter);
router.use(skillsRouter);

export default router;
