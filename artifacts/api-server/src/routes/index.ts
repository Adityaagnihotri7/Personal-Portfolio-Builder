import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import authRouter from "./auth";
import usersRouter from "./users";
import projectsRouter from "./projects";
import skillsRouter from "./skills";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(projectsRouter);
router.use(skillsRouter);

export default router;
