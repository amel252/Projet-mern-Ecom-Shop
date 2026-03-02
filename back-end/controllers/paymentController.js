// // import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
// // import Stripe from "stripe";
// // import Order from "../models/orderModel.js";

// // import path from "path";
// // import dotenv from "dotenv";

// // dotenv.config({ path: path.resolve("./backend/config/config.env") });

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // // 1ere fonction de paiement
// // export const stripeCheckoutSession = catchAsyncErrors(
// //     async (req, res, next) => {
// //         const {
// //             orderItems,
// //             shippingInfo,
// //             itemsPrice,
// //             taxAmount,
// //             shippingAmount,
// //             totalAmount,
// //         } = req.body;

// //         // 🔐 Validation minimale (optionnel mais conseillé)
// //         if (!orderItems || orderItems.length === 0) {
// //             return res.status(400).json({ message: "No order items" });
// //         }

// //         // Créer la commande AVANT Stripe
// //         // const order = await Order.create({
// //         //     user: req.user._id,
// //         //     orderItems,

// //         //     shippingInfo: {
// //         //         address: shippingInfo.address,
// //         //         city: shippingInfo.city,
// //         //         phoneNo: shippingInfo.phoneNo,
// //         //         country: shippingInfo.country,
// //         //     },

// //         //     itemsPrice,
// //         //     taxAmount,
// //         //     shippingAmount,
// //         //     totalAmount,

// //         //     paymentMethod: "Card",
// //         //     paymentStatus: "pending",
// //         // });
// //         // -----------------------------
// //         // Créer la commande en BDD AVANT le paiement
// //         const order = await Order.create({
// //             user: req.user._id,
// //             orderItems,
// //             shippingInfo,
// //             itemsPrice,
// //             taxAmount,
// //             shippingAmount,
// //             totalAmount,
// //             paymentMethod: "Card",
// //             paymentStatus: "pending", // ⚠️ pending tant que paiement pas confirmé
// //         });

// //         // Line items Stripe
// //         const line_items = orderItems.map((item) => ({
// //             price_data: {
// //                 currency: "usd",
// //                 product_data: {
// //                     name: item.name,
// //                     images: [item.image],
// //                 },
// //                 unit_amount: Math.round(item.price * 100),
// //             },
// //             quantity: item.quantity,
// //         }));

// //         // Session Stripe
// //         const session = await stripe.checkout.sessions.create({
// //             payment_method_types: ["card"],
// //             mode: "payment",
// //             line_items,

// //             customer_email: req.user.email,
// //             client_reference_id: req.user._id.toString(),

// //             success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
// //             cancel_url: `${process.env.FRONTEND_URL}/cart`,

// //             metadata: {
// //                 orderId: order._id.toString(),
// //                 // stocker l'id de la commande pour webhook
// //             },
// //         });

// //         res.status(200).json({ url: session.url });
// //     }
// // );
// // //  fonction qui vérifie la requette de stripe de paiement pour valider le paiement on enregistre en BDD
// // export const stripeWebhookHandler = async (req, res) => {
// //     const sig = req.headers["stripe-signature"];
// //     //  la variable contenant l'évenement
// //     let event;
// //     //  verification de la signature (requette)
// //     try {
// //         event = stripe.webhooks.constructEvent(
// //             //  on verifie le body(les données)  , sig, et le webhookSecret
// //             req.body,
// //             sig,
// //             process.env.STRIPE_WEBHOOK_SECRET
// //         );
// //     } catch (error) {
// //         //  si ca marche pas , sig pas valide
// //         console.error("Webhook signature error:", error.message);
// //         return res.status(400).send(`Webhook Error: ${error.message}`);
// //     }
// //     // traitement de l'evenement est reussi lors du paiement
// //     if (event.type === "checkout.session.completed") {
// //         // donnée de la session stripeà la fin du paiement
// //         const session = event.data.object;
// //         //  récup de l'id de la commande en metadata
// //         const orderId = session.metadata.orderId;
// //         //  vérif l'id si existe pas
// //         if (!orderId) {
// //             console.error("orderId manquant dans metadata");
// //             return res.status(400).send("orderId missing");
// //         }
// //         //  si existe on récupére la commande en BD a partir de l'id
// //         const order = await Order.findById(orderId);
// //         //  si la commande n'existe pas envoie msg
// //         if (!order) {
// //             console.error("Commande introuvable:", orderId);
// //             return res.status(404).send("Order not found");
// //         }

// //         //  Sécurité de pas envoyé le meme evenement plusieurs fois (double webhook)
// //         if (order.paymentStatus === "paid") {
// //             return res.status(200).json({ received: true });
// //         }
// //         // commande payé , on met la date exacte
// //         order.paymentStatus = "paid";
// //         order.paidAt = Date.now();
// //         //  sauvegarder les infos du paiement
// //         order.paymentInfo = {
// //             // id du  paiement stripe
// //             id: session.payment_intent,
// //             //     status du paiement
// //             status: session.payment_status,
// //         };
// //         //sauvegarde en BD
// //         await order.save();
// //     }
// //     //  envoie la réponse
// //     res.status(200).json({ received: true });
// // };
// import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
// import Stripe from "stripe";
// import Order from "../models/orderModel.js";

// import path from "path";
// import dotenv from "dotenv";

// dotenv.config({ path: path.resolve("./backend/config/config.env") });

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // 1️⃣ Créer une session de paiement Stripe
// export const stripeCheckoutSession = catchAsyncErrors(
//     async (req, res, next) => {
//         const {
//             orderItems,
//             shippingInfo,
//             itemsPrice,
//             taxAmount,
//             shippingAmount,
//             totalAmount,
//         } = req.body;

//         if (!orderItems || orderItems.length === 0) {
//             return res.status(400).json({ message: "No order items" });
//         }

//         // Créer la commande en BDD AVANT le paiement
//         const order = await Order.create({
//             user: req.user._id,
//             orderItems,
//             shippingInfo,
//             itemsPrice,
//             taxAmount,
//             shippingAmount,
//             totalAmount,
//             paymentMethod: "Card",
//             paymentInfo: {
//                 status: "pending",
//             },
//         });

//         // Préparer les line items pour Stripe
//         const line_items = orderItems.map((item) => ({
//             price_data: {
//                 currency: "usd",
//                 product_data: {
//                     name: item.name,
//                     images: [item.image],
//                 },
//                 unit_amount: Math.round(item.price * 100),
//             },
//             quantity: item.quantity,
//         }));

//         // Créer la session Stripe
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             mode: "payment",
//             line_items,
//             customer_email: req.user.email,
//             client_reference_id: req.user._id.toString(),
//             success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.FRONTEND_URL}/cart`,
//             metadata: {
//                 orderId: order._id.toString(), // stocker l'id de la commande pour webhook
//             },
//         });

//         res.status(200).json({ url: session.url });
//     }
// );

// // 2️⃣ Webhook Stripe pour valider le paiement et mettre à jour la commande
// export const stripeWebhookHandler = async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;
//     // console.log("🔥 WEBHOOK APPELE");

//     // console.log("Headers:", req.headers);
//     // console.log("Body length:", req.body.length);
//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//         console.log("Event type:", event.type);
//     } catch (error) {
//         console.error("Webhook signature error:", error.message);
//         return res.status(400).send(`Webhook Error: ${error.message}`);
//     }

//     // Paiement réussi
//     if (event.type === "checkout.session.completed") {
//         const session = event.data.object;
//         const orderId = session.metadata.orderId;

//         if (!orderId) {
//             // console.error("orderId missing ");
//             // return res.status(400).send("orderId missing");
//             return res.status(400).send("orderId missing");
//         }

//         const order = await Order.findById(orderId);
//         if (!order) return res.status(404).send("Order not found");

//         // if (!order) {
//         //     console.error("Commande introuvable:", orderId);
//         //     return res.status(404).send("Order not found");
//         // }

//         // Sécurité : ne pas traiter deux fois le même webhook
//         if (order.paymentStatus === "paid") {
//             return res.status(200).json({ received: true });
//         }
//         //  commande payée
//         order.paymentStatus = "paid";
//         order.paidAt = Date.now();
//         // Mettre à jour le paiement
//         order.paymentInfo = {
//             id: session.payment_intent || session.id,
//             status: session.payment_status,
//         };

//         await order.save();
//     }

//     res.status(200).json({ received: true });
// };
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Stripe from "stripe";
import Order from "../models/orderModel.js";

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve("./backend/config/config.env") });

// export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
//     // Recup les données envoyées dans le body
//     const {orderItems, shippingInfo, itemsPrice} = req.body
//     // Créer les lines items pour les produits commandés
//     const line_items = orderItems.map((item) => ({
//         price_data: {
//             currency: "usd",
//             product_data: {
//                 name:item.name,
//                 images: [item.image],
//                 metadata: {productId: item.product},
//             },

//             unit_amount: item.price*100,

//         },
//         quantity: item.quantity
//     }));

//     // Creation d'une session stripe
//     const session = await stripe.checkout.sessions.create({
//         // definition de moyen de paiement autorisé
//         payment_method_types: ["card"],
//         // La liste des produits à payer
//         line_items,
//         mode:"payment",
//         // L'email du client pre-rempli sur la page de stripe
//         customer_email: req.user.email,
//         client_reference_id:req.user._id.toString(),
//         success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//         // paiement annulé
//         cancel_url: `${process.env.FRONTEND_URL}/cart`,

//         metadata: {
//             shippingInfo:JSON.stringify(shippingInfo),
//             itemsPrice,
//             orderItems: JSON.stringify(orderItems),
//         },
//     });

//     res.status(200).json({url:session.url});
// })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

        // Validation minimale (optionnel mais conseillé)
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
            // paymentStatus: "pending",
            paymentInfo: {
                status: "pending",
            },
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

export const stripeWebhookHandler = async (req, res) => {
    console.log("🔥 STRIPE WEBHOOK HIT");
    // Elle sert à verifier la requete venant de stripe
    const sig = req.headers["stripe-signature"];
    // La variable contenant l'evenement
    let event;
    // verification de la signature
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Webhook signature error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    // Traitement de l'evenement reussi lors du paiement
    if (event.type === "checkout.session.completed") {
        // Données de la session stripe à la fin du paiement
        const session = event.data.object;
        //  Recup de l'id de la commande dans metaData lors du checkout
        const orderId = session.metadata.orderId;

        // Si l'id n'existe pas
        if (!orderId) {
            console.error("orderId manquant dans metadata");
            return res.status(400).send("orderId missing");
        }

        // On recup la commande en bd à partir de l'id
        const order = await Order.findById(orderId);
        // Si la commande n'existe pas
        if (!order) {
            console.error("Commande introuvable:", orderId);
            return res.status(404).send("Order not found");
        }

        //  Sécurité anti double webhook (pour que le mm evenement ne soit pas envoyé plusieurs fois)
        if (order.paymentStatus === "paid") {
            return res.status(200).json({ received: true });
        }

        // Commande payée
        order.paymentStatus = "paid";
        // Date du paiement
        order.paidAt = Date.now();
        // Sauvegarder les infos du paiment
        order.paymentInfo = {
            id: session.payment_intent, //Id du paiment stripe
            status: session.payment_status, //Status du paiment
        };

        // Sauvegarder en bd
        await order.save();
    }

    // envoi de la reponse
    res.status(200).json({ received: true });
};
