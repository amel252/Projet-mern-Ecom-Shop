import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// create new product => /api/v1/admin/products
export const newProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        product,
    });
};

// getAllProducts
export const getProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        products,
    });
};

// obtenir le details d'un produit
export const getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req?.params.id);

    if (!product) return next(new ErrorHandler("Produit non trouvé", 404));

    res.status(200).json({
        product,
    });
};
// update product (admin)=> /api/v1/products/:id
export const updateProduct = async (req, res, next) => {
    let product = await Product.findByIdAndUpdate(req?.params.id, req.body, {
        new: true,
    });
    if (!product) {
        return next(new ErrorHandler("Produit non trouvé", 404));
    }
    res.status(200).json({
        product,
    });
};
// delete product
export const deleteProduct = async (req, res, next) => {
    let product = await Product.findByIdAndDelete(req?.params.id);
    if (!product) {
        return next(new ErrorHandler("Produit non trouvé", 404));
    }
    await product.deleteOne();
    res.status(200).json({
        message: "Produit supprimé",
    });
};
