import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

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
