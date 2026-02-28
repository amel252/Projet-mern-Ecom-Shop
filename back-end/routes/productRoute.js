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
    uploadProductImage,
    deleteProductImage,
} from "../controllers/productController.js";
import { isAuthentificatedUser, authorizeRole } from "../middleware/auth.js";
//  memoire storage pour récuperer le fichiers (images)
import multer from "multer";
// import { upload_file } from "../utils/cloudinary.js";

const storage = multer.memoryStorage();
const upload = multer(storage);

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

router
    .route("/reviews")
    .put(isAuthentificatedUser, createProductReview)
    .get(isAuthentificatedUser, getProductReviews);
router
    .route("/admin/reviews")
    .delete(isAuthentificatedUser, authorizeRole("admin"), deleteReview);
router.route("/can_review").get(isAuthentificatedUser, canUserReview);

router
    .route("/admin/products/:id/upload_images")
    .put(
        isAuthentificatedUser,
        authorizeRole("admin"),
        upload.array("images"),
        uploadProductImage
    );
router
    .route("/admin/products/:id/delete_images")
    .put(isAuthentificatedUser, authorizeRole("admin"), deleteProductImage);

export default router;

//  on doit matcher le chemin api entre productRoute et notre API redux (meme chemin )
