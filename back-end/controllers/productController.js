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
export const getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 4;

    //  récupération de valeur de filtre
    const priceGte = req.query["price[gte]"]
        ? Number(req.query["price[gte]"])
        : undefined;
    const priceLte = req.query["price[lte]"]
        ? Number(req.query["price[lte]"])
        : undefined;
    const keyword = req.query.keyword || undefined;
    const page = Number(req.query.page) || 1;

    //  construction de filtre
    const filter = {};
    if (priceGte !== undefined || priceLte !== undefined) {
        filter.price = {};
        if (priceGte !== undefined) filter.price.$gte = priceGte;
        if (priceLte !== undefined) filter.price.$lte = priceLte;
    }
    if (keyword) {
        filter.name = {
            $regex: keyword,
            $options: "i",
        };
    }

    //  chercher les produits filtrées
    const totalProducts = await Product.find(filter);
    const filteredProductsCount = totalProducts.length;

    const products = await Product.find(filter)
        .limit(resPerPage)
        .skip(resPerPage * (page - 1));

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
        return next(new ErrorHandler("Product does not existe", 404));
    }
    await product.deleteOne();
    res.status(200).json({
        message: "Product deleted",
    });
});

// create/ update product review => api/v1/review
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    // récupere le rating , le comment , productId
    const { rating, comment, productId } = req.body;
    // on crée un objet qui représente user review
    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
    };
    //  search product from bd pour l'évalué
    const product = await Product.findById(productId);
    //  si produit n'existe pas
    if (!product) {
        return next(new ErrorHandler("Product not found"));
    }
    //  we have an array because product can have many ratings
    //  on vérifie si l'user a mis une evaluation (dans la BD)
    const isReviewed = product?.reviews.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    );
    if (isReviewed) {
        //
        product.reviews.forEach((review) => {
            if (review?.user?.toString() === req?.user?._id.toString()) {
                (review.comment = comment), (review.rating = rating);
            }
        });
    } else {
        //  on ajoute le nouveau avis à l'array
        product.reviews.push(review);
        //  mise a jour du nombre d'avis
        product.numOfReviews = product.reviews.length;
    }
    //  calculé la moyenne du produit du reviews existantes
    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    //  on sauvegarde le produit en BD
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});

//  get product reviews => /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("Product not found ", 400));
    }
    res.status(200).json({
        reviews: product.reviews,
    });
});

//  delete product review /api/v1/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
    //  find product in BD
    let product = await Product.findById(req.query.productId);
    //  si produit n'existe pas
    if (!product) {
        return next(new ErrorHandler("Product not found"));
    }
    const reviews = product?.reviews?.filter(
        (review) => review._id.toString() !== req?.query?.id.toString()
    );
    //  donne le nombre d'évaluation
    const numOfReviews = reviews.length;
    //  si le nombre est 0
    const ratings =
        numOfReviews === 0
            ? 0
            : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
              numOfReviews;
    //  on mis a jour le nombre de reviews en supprimant le reviews
    product = await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            numOfReviews,
            ratings,
        },
        { new: true }
    );
    res.status(200).json({
        success: true,
        product,
    });
});
