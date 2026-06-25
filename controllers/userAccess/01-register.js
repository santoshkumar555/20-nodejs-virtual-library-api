import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import sendEmail from "../../config/emailService.js";
import generateToken from "./generateToken.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const allowedRoles = ["user", "author", "admin"];
        const assignedRole = allowedRoles.includes(role) ? role : "user";

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: assignedRole,
        });

        const token = generateToken(user._id);

        sendEmail({
            to: user.email,
            subject: "Welcome to Virtual Library",
            text: `Hello ${user.name}, welcome! Your role is: ${user.role}.`,
        });

        res.status(201).json({
            success: true,
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
