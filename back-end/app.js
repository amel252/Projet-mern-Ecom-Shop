import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "back-end/config/config.env" });
import ProductRoutes from "./routes/productRoute.js";

const app = express();

app.use("/api/v1", ProductRoutes);

app.listen(process.env.PORT, () => {
    console.log(
        `Le serveur est lancé sur le port: ${process.env.PORT} en mode :${process.env.NODE_ENV}`
    );
});
