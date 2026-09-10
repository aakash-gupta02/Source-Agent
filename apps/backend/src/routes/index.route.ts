import { Router } from "express";

import authRoutes from "../modules/auth/auth.route.js";
import connectionRoutes from "../modules/connection/correction.route.js";
import aiProviderRoutes from "../modules/aiProvider/aiProvider.route.js";
import conversationRoutes from "../modules/conversation/conversation.route.js";
/* <NEATNODE_IMPORTS> */

const router = Router();

router.use("/auth", authRoutes);
router.use("/connection", connectionRoutes);
router.use("/aiProvider", aiProviderRoutes);
router.use("/conversation", conversationRoutes);
/* <NEATNODE_ROUTES> */

export default router;
