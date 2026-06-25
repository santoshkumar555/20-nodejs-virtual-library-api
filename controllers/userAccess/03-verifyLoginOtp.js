import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import generateToken from "./generateToken.js";

export const verifyLoginOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email }).select(
            "+loginOtp +loginOtpExpire"
        );
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "Invalid credentials" });

        if (!user.loginOtp || user.loginOtpExpire < Date.now())
            return res.status(401).json({
                success: false,
                message: "OTP has expired. Please request a new one.",
            });

        const isMatch = await bcrypt.compare(otp, user.loginOtp);
        if (!isMatch)
            return res
                .status(401)
                .json({ success: false, message: "Invalid OTP" });

        user.loginOtp = undefined;
        user.loginOtpExpire = undefined;
        await user.save({ validateBeforeSave: false });

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};
