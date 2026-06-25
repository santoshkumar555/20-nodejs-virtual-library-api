import bcrypt from "bcryptjs";
import User from "../../models/User.js";

export const adminCreateUser = async (req, res, next) => {
    try {
        if (req.body.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot create another admin account",
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await User.create({
            ...req.body,
            password: hashedPassword,
        });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
