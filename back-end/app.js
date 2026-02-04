import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: "back-end/config/config.env" });
import cors from "cors"; // ✅ AJOUT
import productRoutes from "./routes/productRoute.js";
import authRoutes from "./routes/authRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import { connectedDatabase } from "./config/dbConnect.js";
// on l'importe sans nom
import errorMiddleware from "./middleware/error.js";
// import { log } from "console";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/paymentRoute.js";
import bodyParser from "body-parser";

const app = express();

connectedDatabase();

app.use(
    "/api/v1/payment/webhook",
    bodyParser.raw({ type: "application/json" })
);
app.use(express.json());
app.use(cookieParser());
// ✅ CORS DOIT ÊTRE AVANT LES ROUTES
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);
// middleware de gestion d'erreur
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(
        `Le serveur est lancé sur le port: ${process.env.PORT} en mode :${process.env.NODE_ENV}`
    );
});

// Gestion des promesses non gérer => en cas que la requette ne marche pas
process.on("unhandledRejection", (err) => {
    console.log("ERROR:", err);
    console.log("Stack trace", err.stack);
    server.close(() => {
        process.exit(1);
    });
});
