import express from "express";
import { isAuthentificatedUser } from "../middleware/auth.js";
import { newOrder } from "../controllers/orderController.js";

const router = express.Router();

router.route("/orders/new").post(isAuthentificatedUser, newOrder);

export default router;
