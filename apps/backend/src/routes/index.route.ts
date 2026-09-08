import { Router } from "express";

import authRoutes from "../modules/auth/auth.route.js";
import connectionRoutes from "../modules/connection/correction.route.js";
/* <NEATNODE_IMPORTS> */

const router = Router();

router.use("/auth", authRoutes);
router.use("/connection", connectionRoutes);
/* <NEATNODE_ROUTES> */

export default router;
