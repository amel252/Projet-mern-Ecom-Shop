import express from "express";
import {
    createProductReview,
    deleteProduct,
    getProductDetails,
    getProducts,
    newProduct,
    updateProduct,
    getProductReviews,
    deleteReview,
    canUserReview,
    getAdminProducts,
} from "../controllers/productController.js";
import { isAuthentificatedUser, authorizeRole } from "../middleware/auth.js";

// j'ai instiancé expresss
const router = express.Router();

router.route("/products").get(getProducts);
router
    .route("/admin/products")
    .post(isAuthentificatedUser, authorizeRole("admin"), newProduct)
    .get(isAuthentificatedUser, authorizeRole("admin"), getAdminProducts);
//  si le chemin est le meme on peut les enchainer sur le meme router
router.route("/products/:id").get(getProductDetails);
router
    .route("/products/:id")
    .put(isAuthentificatedUser, authorizeRole("admin"), updateProduct);
router
    .route("/products/:id")
    .delete(isAuthentificatedUser, authorizeRole("admin"), deleteProduct);

//
router
    .route("/reviews")
    .put(isAuthentificatedUser, createProductReview)
    .get(isAuthentificatedUser, getProductReviews);
router
    .route("/admin/reviews")
    .delete(isAuthentificatedUser, authorizeRole("admin"), deleteReview);
router.route("/can_review").get(isAuthentificatedUser, canUserReview);

export default router;
