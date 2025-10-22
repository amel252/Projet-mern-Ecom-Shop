import express from "express";
import { getProducts } from "../controllers/productController.js";

// j'ai instiancé expresss
const router = express.Router();

router.route("/products").get(getProducts);

export default router;
