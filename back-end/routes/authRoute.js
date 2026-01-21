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
    updateProfile,
    getAllUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    uploadAvatar,
} from "../controllers/authController.js";
import { authorizeRole, isAuthentificatedUser } from "../middleware/auth.js";

// Mpd routes
router.route("/password/forgot").post(forgotPassword);
//  revoir postman avec cette function
router.route("/password/reset/:token").put(resetPassword);

// autehtification routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

// user info ( un simple user récup ces données mettre à jou et suppr)
router.route("/me").get(isAuthentificatedUser, getUserProfile);
router.route("/password/update").put(isAuthentificatedUser, updatePassword);
router.route("/me/update").put(isAuthentificatedUser, updateProfile);
router.route("/me/upload_avatar").put(isAuthentificatedUser, uploadAvatar);

//  admin routes ( récupere les users , update un profil user n suppr aussi)
router
    .route("/admin/users")
    .get(isAuthentificatedUser, authorizeRole("admin"), getAllUsers);
router
    .route("/admin/users/:id")
    .get(isAuthentificatedUser, authorizeRole("admin"), getUserDetails)
    .put(isAuthentificatedUser, authorizeRole("admin"), updateUser)
    .delete(isAuthentificatedUser, authorizeRole("admin"), deleteUser);

export default router;
