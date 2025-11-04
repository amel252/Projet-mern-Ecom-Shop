import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: "back-end/config/config.env" });
import productRoutes from "./routes/productRoute.js";
import authRoutes from "./routes/authRoute.js";
import { connectedDatabase } from "./config/dbConnect.js";
// on l'importe sans nom
import errorMiddleware from "./middleware/error.js";
// import { log } from "console";
import cookieParser from "cookie-parser";

const app = express();

connectedDatabase();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
// middleware de gestion d'erreur
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(
        `Le serveur est lancé sur le port: ${process.env.PORT} en mode :${process.env.NODE_ENV}`
    );
});

// Gestion des promesses non gérer => en cas que la requette ne marche pas
process.on("unhandledRejection", (err) => {
    console.log("ERROR:", err);
    console.log("Stack trace", err.stack);
    Server.close(() => {
        process.exit(1);
    });
});
