import express from "express";
import { isAuthentificatedUser } from "../middleware/auth.js";
import {
    getOrderDetails,
    myOrders,
    newOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/orders/new").post(isAuthentificatedUser, newOrder);
router.route("/orders/:id").get(isAuthentificatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthentificatedUser, myOrders);

export default router;
