import express from "express";
import {
    getProductDetails,
    getProducts,
    newProduct,
    updateProduct,
} from "../controllers/productController.js";

// j'ai instiancé expresss
const router = express.Router();

router.route("/admin/products").post(newProduct);
router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(updateProduct);

export default router;
