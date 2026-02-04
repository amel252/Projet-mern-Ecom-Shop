import express from "express";
import { isAuthentificatedUser } from "../middleware/auth.js";
import {
    stripeCheckoutSession,
    stripeWebhookHandler,
} from "../controllers/paymentController.js";
import bodyParser from "body-parser";

const router = express.Router();

router.post(
    "/payment/checkout_session",
    isAuthentificatedUser,
    stripeCheckoutSession
);
//  webhook stripe
router.post(
    "/payment/webhook",
    bodyParser.raw({ type: "application/json" }),
    stripeWebhookHandler
);
export default router;
