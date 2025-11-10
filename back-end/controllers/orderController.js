import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/orderModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    //  recevoir le details a partir de body
    const {
        orderItem,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;
    //  créer une commande
    const order = await Order.create({
        orderItem,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id,
    });
    res.status(200).json({
        order,
    });
});
//  get Order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    // populate permet de referencier l'user
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }
    res.status(200).json({
        order,
    });
});
//  get current user's orders => /api/v1/me/orders/
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        orders,
    });
});
