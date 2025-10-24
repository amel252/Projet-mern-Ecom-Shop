import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
    res.status(200).json({
        message: "Tous les produits",
    });
};
// create new product => /api/v1/admin/products
export const newProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        product,
    });
};
