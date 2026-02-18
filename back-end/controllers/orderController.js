import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    //  recevoir le details a partir de body
    const {
        orderItems,
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
        orderItems,
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

//  get all orders  Admin=> /api/v1/admin/orders

export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
        orders,
    });
});

//  update Orders => Admin =>/api/v1/admin/orders
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("this order is already delivred", 400));
    }

    // Mise à jour des stocks
    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);

        if (!product) {
            return next(
                new ErrorHandler("Aucun produit trouvé avec cet ID", 404)
            );
        }

        product.stock -= item.quantity;

        await product.save({ validateBeforeSave: false });
    }
    //  mettre a jour le status de la commande
    order.orderStatus = req.body.status;
    //  la commande est livré , on précise la date
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    //  enregistré la mise a jour du status
    await order.save();

    res.status(200).json({
        success: true,
    });
});

// export const updateOrder = catchAsyncErrors(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);
//     //  si order n'existe pas
//     if (!order) {
//         return next(new ErrorHandler("No order found with this ID ", 404));
//     }
//     //  si order est déja livré
//     if (order?.orderStatus === "Delivered") {
//         return next(
//             new ErrorHandler("You have already delivred this order", 400)
//         );
//     }
//     //  mise à jour du stock update products , parcourir chaque item
//     order?.orderItems?.forEach(async (item) => {
//         const product = await Product.findById(item?.product?.toString());
//         //  si produit est supprimé ou existe pas
//         if (!product) {
//             return next(new ErrorHandler("No product found with this ID", 404));
//         }
//         //  quand on modifie la commande , on diminue le stock selon la quantité commandé
//         product.stock = product.stock - item.quantity;
//         await product.save({ validateBeforeSave: false });
//     });
//     order.orderStatus = req.body.status;
//     order.deliveredAt = Date.now();
//     await order.save();
//     res.status(200).json({
//         success: true,
//     });
// });

// Delete order-Admin /api.v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("this order is already delivred", 400));
    }
    await order.deleteOne();

    res.status(200).json({
        success: true,
    });
});
