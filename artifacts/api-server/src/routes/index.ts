import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import usersRouter from "./users";
import projectsRouter from "./projects";
import skillsRouter from "./skills";
import contactRouter from "./contact";
import templatesRouter from "./templates";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(usersRouter);
router.use(projectsRouter);
router.use(skillsRouter);
router.use(contactRouter);
router.use(templatesRouter);

export default router;
