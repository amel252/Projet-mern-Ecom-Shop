import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
// inscription de User
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });
    const token = user.getJwtToken();
    res.status(201).json({ token });
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
    const token = user.getJwtToken();
    res.status(200).json({
        token,
    });
});
