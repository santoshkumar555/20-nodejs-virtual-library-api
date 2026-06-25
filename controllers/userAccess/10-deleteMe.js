import User from "../../models/User.js";
import Book from "../../models/Book.js";

export const deleteMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });

        user.isDeleted = true;
        await user.save({ validateBeforeSave: false });

        if (user.role === "author" || user.role === "admin") {
            await Book.updateMany({ createdBy: user._id }, { isDeleted: true });
        }

        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
