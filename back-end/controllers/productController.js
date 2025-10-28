import Product from "../models/productModel.js";

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
export const getProductDetails = async (req, res) => {
    const product = await Product.findById(req?.params.id);
    if (!product)
        return res.status(404).json({
            error: "Produit non trouvé",
        });

    res.status(200).json({
        product,
    });
};
