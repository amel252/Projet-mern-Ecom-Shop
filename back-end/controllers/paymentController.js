import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Stripe from "stripe";
import Order from "../models/orderModel.js";

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve("./backend/config/config.env") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1ere fonction de paiement
export const stripeCheckoutSession = catchAsyncErrors(
    async (req, res, next) => {
        const {
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
        } = req.body;

        // 🔐 Validation minimale (optionnel mais conseillé)
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        // Créer la commande AVANT Stripe
        const order = await Order.create({
            user: req.user._id,
            orderItems,

            shippingInfo: {
                address: shippingInfo.address,
                city: shippingInfo.city,
                phoneNo: shippingInfo.phoneNo,
                country: shippingInfo.country,
            },

            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,

            paymentMethod: "Card",
            paymentStatus: "pending",
        });

        // Line items Stripe
        const line_items = orderItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Session Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,

            customer_email: req.user.email,
            client_reference_id: req.user._id.toString(),

            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,

            metadata: {
                orderId: order._id.toString(),
            },
        });

        res.status(200).json({ url: session.url });
    }
);
//  fonction qui vérifie la requette de stripe de paiement pour valider le paiement on enregistre en BDD
export const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    //  la variable contenant l'évenement
    let event;
    //  verification de la signature (requette)
    try {
        event = stripe.webhooks.constructEvent(
            //  on verifie le body(les données)  , sig, et le webhookSecret
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        //  si ca marche pas , sig pas valide
        console.error("Webhook signature error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    // traitement de l'evenement est reussi lors du paiement
    if (event.type === "checkout.session.completed") {
        // donnée de la session stripeà la fin du paiement
        const session = event.data.object;
        //  récup de l'id de la commande en metadata
        const orderId = session.metadata.orderId;
        //  vérif l'id si existe pas
        if (!orderId) {
            console.error("orderId manquant dans metadata");
            return res.status(400).send("orderId missing");
        }
        //  si existe on récupére la commande en BD a partir de l'id
        const order = await Order.findById(orderId);
        //  si la commande n'existe pas envoie msg
        if (!order) {
            console.error("Commande introuvable:", orderId);
            return res.status(404).send("Order not found");
        }

        //  Sécurité de pas envoyé le meme evenement plusieurs fois (double webhook)
        if (order.paymentStatus === "paid") {
            return res.status(200).json({ received: true });
        }
        // commande payé , on met la date exacte
        order.paymentStatus = "paid";
        order.paidAt = Date.now();
        //  sauvegarder les infos du paiement
        order.paymentInfo = {
            // id du  paiement stripe
            id: session.payment_intent,
            //     status du paiement
            status: session.payment_status,
        };
        //sauvegarde en BD
        await order.save();
    }
    //  envoie la réponse
    res.status(200).json({ received: true });
};
