import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";
import { upload_file } from "../utils/cloudinary.js";

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

//  user profile => /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id);
    res.status(200).json({
        user,
    });
});
//  mise a jour PWD
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    //  il doit etre connécté , récup l'user a partir de son id
    const user = await User.findById(req?.user?._id).select("+password");
    //  vérif de l'ancien MPD
    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Old password is incorrect", 404));
    }
    //  l'ancien mpd recoit la nouvel valeur mpd (obligé de marqué la meme chose )
    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        message: "Password update successufy",
    });
});

//  update user profile => /api/v1/update (user)

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
    });
    res.status(200).json({
        user,
    });
});

//  get all users (admin) /api/v1/admin/users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    //  aller récuperer tout les users
    const users = await User.find();
    res.status(200).json({
        users,
    });
});
//  get User details = > (admin ) /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new ErrorHandler(`User not found id: ${req.params.id}`, 404)
        );
    }
    res.status(200).json({
        user,
    });
});
//  update User details (adimi) /api/v1/admin/:id

export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
    });
    res.status(200).json({
        user,
    });
});

//  delete user (admin)=> /api/v1/admin/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new ErrorHandler(`User not found with id ${req.params.id}`, 404)
        );
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
    });
});
//  upload user Avatar => /api/v1/me/upload_avatar

export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    //  dans cloudinary on aura fichier Home/avatar  qui stock imgs
    const avatarResponse = await upload_file(req.body.avatar, "Home/avatar");

    //remove previous avatar
    if (req?.avatar?.url) {
        await delete_file(req?.user?.avatar?.public_id);
    }
    const user = await User.findByIdAndUpdate(req?.user._id, {
        avatar: avatarResponse,
    });
    res.status(200).json({
        user,
    });
});
