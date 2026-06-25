import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import sendEmail from "../../config/emailService.js";

export const sendLoginOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({
                success: false,
                message: "No account found with this email",
            });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const salt = await bcrypt.genSalt(5);
        user.loginOtp = await bcrypt.hash(otp, salt);
        user.loginOtpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

        await user.save({ validateBeforeSave: false });

        await sendEmail({
            to: user.email,
            subject: "Your Library Login OTP",
            text: `Your login OTP is: ${otp}. It expires in 5 minutes.`,
        });

        res.status(200).json({
            success: true,
            message: "OTP sent to your email",
            otp: otp,
        });
    } catch (error) {
        next(error);
    }
};
