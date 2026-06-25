import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import generateToken from "./generateToken.js";

export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword)
            return res.status(400).json({
                success: false,
                message: "Please provide email, otp, and newPassword",
            });

        const user = await User.findOne({ email });

        if (!user || !user.resetPasswordToken)
            return res.status(400).json({
                success: false,
                message: "Invalid request or OTP expired",
            });

        if (user.resetPasswordExpire < Date.now())
            return res
                .status(400)
                .json({ success: false, message: "OTP has expired" });

        const isMatch = await bcrypt.compare(otp, user.resetPasswordToken);
        if (!isMatch)
            return res
                .status(400)
                .json({ success: false, message: "Invalid OTP" });

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};
