import express from "express";
import {
    getProductDetails,
    getProducts,
    newProduct,
} from "../controllers/productController.js";

// j'ai instiancé expresss
const router = express.Router();

router.route("/admin/products").post(newProduct);
router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductDetails);

export default router;
