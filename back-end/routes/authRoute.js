import express from "express";
const router = express.Router();

import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
} from "../controllers/authController.js";
import { isAuthentificatedUser } from "../middleware/auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/forgot/password").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthentificatedUser, getUserProfile);

export default router;
