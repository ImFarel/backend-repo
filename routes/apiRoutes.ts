import { Router } from "express";

import { updateUserData, fetchUserData } from "../controllers/usersController";
import { login, register } from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.put("/update-user-data/:userId", authMiddleware, updateUserData);
router.get("/fetch-user-data", authMiddleware, fetchUserData);

export default router;
