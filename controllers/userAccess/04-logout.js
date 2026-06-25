export const logout = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};
