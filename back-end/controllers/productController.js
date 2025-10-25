import Product from "../models/productModel.js";

// create new product => /api/v1/admin/products
export const newProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        product,
    });
};

// getAllProducts
export const getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        products,
    });
};
