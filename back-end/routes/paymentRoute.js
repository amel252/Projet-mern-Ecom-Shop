import express from "express";
import { isAuthentificatedUser } from "../middleware/auth.js";
import { stripeCheckoutSession } from "../controllers/paymentController.js";
import bodyParser from "body-parser";

const router = express.Router();
router.post(
    "/payment/checkout_session",
    isAuthentificatedUser,
    stripeCheckoutSession
);
export default router;
