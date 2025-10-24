import express from "express";
import { getProducts, newProduct } from "../controllers/productController.js";

// j'ai instiancé expresss
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(newProduct);

export default router;
