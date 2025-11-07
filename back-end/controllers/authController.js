import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";

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

// forgot PWD => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    //  recherche si utilisateur est déja existant en BD
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("user not found with this email", 404));
    }
    // si existe => récup de token
    const resetToken = user.getResetPasswordToken();
    await user.save();
    // création de reset Password Url
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;
    const message = getResetPasswordTemplate(user?.name, resetUrl);
    try {
        await sendEmail({
            email: user.email,
            subject: "Shop password Recovery",
            message,
        });
        res.status(200).json({
            message: `Email sent to:${user.email}`,
        });
        return;
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpired = undefined;
        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }
});
// reset password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    //  hasher le token en url
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpired: { $gt: Date.now() },
    });
    if (!user) {
        return next(
            new ErrorHandler(
                "password reset token is invalid or has been expired",
                400
            )
        );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }
    //  nouveau MDP
    user.password = req.body.password;
    //  une fois il est pris en compte on le passe en undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save();
    sendToken(user, 200, res);
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

//  reset password
