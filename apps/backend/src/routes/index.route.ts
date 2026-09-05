import { Router } from "express";

import authRoutes from "../modules/auth/auth.route.js";
/* <NEATNODE_IMPORTS> */

const router = Router();

router.use("/auth", authRoutes);
/* <NEATNODE_ROUTES> */

export default router;
