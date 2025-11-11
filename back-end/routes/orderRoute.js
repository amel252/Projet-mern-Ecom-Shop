import express from "express";
import { authorizeRole, isAuthentificatedUser } from "../middleware/auth.js";
import {
    newOrder,
    getOrderDetails,
    myOrders,
    allOrders,
    updateOrder,
    deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/orders/new").post(isAuthentificatedUser, newOrder);
router.route("/orders/:id").get(isAuthentificatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthentificatedUser, myOrders);

//  route pour l'admin
router
    .route("/admin/orders")
    .get(isAuthentificatedUser, authorizeRole("admin"), allOrders);
router
    .route("/admin/orders/:id")
    .put(isAuthentificatedUser, authorizeRole("admin"), updateOrder)
    .delete(isAuthentificatedUser, authorizeRole("admin"), deleteOrder);

export default router;
