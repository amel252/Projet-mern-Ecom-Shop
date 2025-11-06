import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import APIFilters from "../utils/apiFilter.js";

// create new product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
    //  sauvegarder l'utilisateur connécté
    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    res.status(200).json({
        product,
    });
});

// getAllProducts
export const getProducts = catchAsyncErrors(async (req, res) => {
    const resPerPage = 4;

    let apiFilters = new APIFilters(Product, req.query).search().filters();
    // on met let pour qu'on puisse la réassigné
    let products = await apiFilters.query;

    let filteredProductsCount = products.length;
    apiFilters.pagination(resPerPage);

    products = await apiFilters.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    });
});

// obtenir le details d'un produit
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params.id);

    if (!product) return next(new ErrorHandler("Produit non trouvé", 404));

    res.status(200).json({
        product,
    });
});
// update product (admin)=> /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findByIdAndUpdate(req?.params.id, req.body, {
        new: true,
    });
    if (!product) {
        return next(new ErrorHandler("Produit non trouvé", 404));
    }
    res.status(200).json({
        product,
    });
});
// delete product
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findByIdAndDelete(req?.params.id);
    if (!product) {
        return next(new ErrorHandler("Produit non trouvé", 404));
    }
    await product.deleteOne();
    res.status(200).json({
        message: "Produit supprimé",
    });
});
