import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please enter product name "],
            maxLength: [200, "product name can not exceed 200 characters"],
        },
        price: {
            type: {
                type: Number,
                required: [true, "please enter product price "],
                max: [99999, "product price can not exceed 5 digits"],
            },
        },
        description: {
            type: String,
            required: [true, "please enter product description"],
        },
        ratings: {
            type: Number,
            default: 0,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        category: {
            type: String,
            required: [true, "please select a correct category"],
            enum: {
                values: [
                    "Electronics",
                    "Cameras",
                    "Laptops",
                    "Accessories",
                    "Headphones",
                    "Food",
                    "Books",
                    "Sports",
                    "Outdoor",
                    "Home",
                ],
                message: "please select a correct category",
            },
        },
        seller: {
            type: String,
            required: [true, "Vplease enter product seller"],
        },
        stock: {
            type: Number,
            required: [true, "Please enter product stock"],
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: Number,
                    required: true,
                },
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model("Product", productSchema);
export default Product;
