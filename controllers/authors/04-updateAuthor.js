import Author from "../../models/Author.js";

export const updateAuthor = async (req, res, next) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!author)
            return res
                .status(404)
                .json({ success: false, message: "Author not found" });
        res.status(200).json({ success: true, data: author });
    } catch (error) {
        next(error);
    }
};
