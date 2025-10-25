import mongoose from "mongoose";
import Product from "../models/productModel.js";
import products from "./data.js";

const seedProduct = async () => {
    try {
        mongoose.connect(
            "mongodb+srv://amelGhanem25:amelGhanem25@web.xnpdxmd.mongodb.net/Ecommerce-shop?appName=web"
        );
        await Product.deleteMany();
        console.log("Tous les produits sont supprimés");
        await Product.insertMany(products);
        console.log("Produits inséré en BD");
        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
};
seedProduct();
