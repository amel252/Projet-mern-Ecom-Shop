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
//  ------- sales et orders----
function getDateBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    //  tant que la date actuelle est inf et egal a la endDate , tu formate
    while (currentDate <= new Date(endDate)) {
        const formatedDate = currentDate.toISOString().split("T")[0];
        dates.push(formatedDate);
        //  faut inclementer pour ne pas avoir boucle infini
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}
//  ------- function qui fait la requette en BD  =>/api/v1/admin/get_sales
async function getSalesDate(startDate, endDate) {
    const salesDate = await Order.aggregate([
        {
            //  filtrer les resultats
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            },
        },
        {
            //  grouper la data
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                },
                totaSales: { $sum: 1 },
                numOrder: { $sum: 1 },
            },
        },
        {
            //  trier par date
            $sort: { "_id.date": 1 },
        },
    ]);
    return salesDate;
}
//  recup ventes
export const getSales = catchAsyncErrors(async (req, res, next) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    //  definir les horaires de la journée exacte
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    //  récup les ventes depuis MongoDb
    const salesDate = await getSalesDate(startDate, endDate);
    //  les dates entre la date du début et de la fin
    const allDates = getDateBetween(startDate, endDate);

    //  completer les dates manquantes
    const finalSalesDate = allDates.map((date) => {
        //  on compare ce qu'on a dans mongodb
        const found = salesDate.find((s) => s._id === date);
        //  si la date existe on lui passe la date , totalSales, numOrder
        return found ? found : { _id: { date }, totaSales: 0, numOrder: 0 };
    });
    //  totalisation la moyenne de nos sales et orders
    const totalSales = finalSalesDate.reduce(
        (acc, cur) => acc + cur.totaSales,
        0
    );
    const totalOrders = finalSalesDate.reduce(
        (acc, cur) => acc + cur.numOrder,
        0
    );

    res.status(200).json({
        success: true,
        salesDate: finalSalesDate,
        totalSales,
        totalOrders,
    });
});
