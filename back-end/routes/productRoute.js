import express from "express";
import {
    createProductReview,
    deleteProduct,
    getProductDetails,
    getProducts,
    newProduct,
    updateProduct,
} from "../controllers/productController.js";
import { isAuthentificatedUser, authorizeRole } from "../middleware/auth.js";

// j'ai instiancé expresss
const router = express.Router();

router.route("/products").get(getProducts);
router
    .route("/admin/products")
    .post(isAuthentificatedUser, authorizeRole("admin"), newProduct);
router.route("/products/:id").get(getProductDetails);
router
    .route("/products/:id")
    .put(isAuthentificatedUser, authorizeRole("admin"), updateProduct);
router
    .route("/products/:id")
    .delete(isAuthentificatedUser, authorizeRole("admin"), deleteProduct);
router.route("/reviews").put(isAuthentificatedUser, createProductReview);

export default router;
