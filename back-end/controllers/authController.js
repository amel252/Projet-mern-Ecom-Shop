import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";

// inscription de User
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });
    res.status(201).json({ succes: true });
});
