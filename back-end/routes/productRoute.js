import express from "express";
import {
    deleteProduct,
    getProductDetails,
    getProducts,
    newProduct,
    updateProduct,
} from "../controllers/productController.js";
import { isAuthentificatedUser, authorizeRole } from "../middleware/auth.js";

// j'ai instiancé expresss
const router = express.Router();

router.route("/admin/products").post(newProduct);
router
    .route("/products")
    .get(isAuthentificatedUser, authorizeRole("admin"), getProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(updateProduct);
router.route("/products/:id").delete(deleteProduct);

export default router;
