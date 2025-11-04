import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";

// inscription de User
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (name === "" || email === "" || password === "") {
        return next(new ErrorHandler("All fields are required ", 400));
    }
    const user = await User.create({
        name,
        email,
        password,
    });
    sendToken(user, 201, res);
});
// connexion
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        return next(new ErrorHandler("please enter your email and password"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email and password", 401));
    }
    //  si pwd est correct
    const isPwdMatched = await user.comparePassword(password);
    if (!isPwdMatched) {
        return next(new ErrorHandler("password does'nt match"));
    }
    sendToken(user, 200, res);
});
// fonction de déconnexion
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        httpOnly: true,
    });
    res.status(200).json({
        message: "Logged Out",
    });
});
