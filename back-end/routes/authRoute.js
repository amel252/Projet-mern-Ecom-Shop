import express from "express";
const router = express.Router();

import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    getUserDetails,
    getAllUsers,
} from "../controllers/authController.js";
import { authorizeRole, isAuthentificatedUser } from "../middleware/auth.js";

// Mpd routes
router.route("/forgot/password").post(forgotPassword);
//  revoir postman avec cette function
router.route("/password/reset/:token").put(resetPassword);

// autehtification routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

// user info
router.route("/me").get(isAuthentificatedUser, getUserProfile);
router.route("/password/update").put(isAuthentificatedUser, updatePassword);

//  admin routes
router
    .route("/admin/users")
    .get(isAuthentificatedUser, authorizeRole("admin"), getAllUsers);
router
    .route("/admin/user/:id")
    .get(isAuthentificatedUser, authorizeRole("admin"), getUserDetails);
export default router;
