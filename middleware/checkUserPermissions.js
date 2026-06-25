export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: `Role '${req.user.role}' not authorized`,
                });
        }
        next();
    };
};
export const checkOwnership = (Model) => {
    return async (req, res, next) => {
        const resource = await Model.findById(req.params.id);
        if (!resource)
            return res
                .status(404)
                .json({ success: false, message: "Resource not found" });
        if (
            req.user.role === "admin" ||
            resource.createdBy.toString() === req.user.id
        )
            return next();
        return res
            .status(403)
            .json({
                success: false,
                message: "You can only modify your own resources",
            });
    };
};
