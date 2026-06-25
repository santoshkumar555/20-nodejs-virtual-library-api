import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import sendEmail from "../../config/emailService.js";

export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with this email",
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP
        const salt = await bcrypt.genSalt(5);
        user.resetPasswordToken = await bcrypt.hash(otp, salt);
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save({ validateBeforeSave: false });

        const message = `Your OTP is ${otp}. Expires in 10 mins.`;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset OTP",
                text: message,
            });

            res.status(200).json({
                success: true,
                message: "OTP sent to your email",
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: "Failed to send email",
            });
        }
    } catch (error) {
        next(error);
    }
};
