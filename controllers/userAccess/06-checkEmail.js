import User from "../../models/User.js";

export const checkEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user)
            return res.status(400).json({
                success: false,
                message: "Email is already registered",
            });
        res.status(200).json({ success: true, message: "Email is available" });
    } catch (error) {
        next(error);
    }
};
