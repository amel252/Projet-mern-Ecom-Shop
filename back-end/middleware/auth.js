import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//  fonction permettant de savoir si l'user est connécté ou pas?
export const isAuthentificatedUser = catchAsyncErrors(
    async (req, res, next) => {
        const token = req.cookies?.token;
        // si token n'existe pas
        if (!token) {
            return next(
                new ErrorHandler("Login first to access this resource", 401)
            );
        }
        //  vérifié le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //  si existe on va l'inclure sur notre requette
        req.user = await User.findById(decoded.id);
        next();
    }
);

// fonction pour user role
export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role(${req.user.role}) is not allowed to access to this resource`,
                    403
                )
            );
        }
        next();
    };
};
