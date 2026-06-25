const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError")
        return res
            .status(404)
            .json({ success: false, message: "Resource not found" });

    if (err.code === 11000)
        return res
            .status(400)
            .json({ success: false, message: "Duplicate field value" });

    if (err.name === "ValidationError")
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors)
                .map((val) => val.message)
                .join(", "),
        });

    if (err.code === "LIMIT_FILE_SIZE")
        return res.status(400).json({ success: false, message: "Max 5MB" });
    res.status(500).json({
        success: false,
        message: error.message || "Server Error",
    });
};
export default errorHandler;
