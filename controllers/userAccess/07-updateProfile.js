import bcrypt from "bcryptjs";
import User from "../../models/User.js";

export const updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {};

        if (req.body.name) fieldsToUpdate.name = req.body.name;
        if (req.body.email) fieldsToUpdate.email = req.body.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(12);
            fieldsToUpdate.password = await bcrypt.hash(req.body.password, salt);
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
