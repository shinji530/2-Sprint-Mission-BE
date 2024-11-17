import express from "express";
import { getUser, patchUser, patchPassword } from "../controllers/userController";

const router = express.Router();

router.get("/me", getUser);
router.patch("/me", patchUser);
router.patch("/me/password", patchPassword);

export default router;