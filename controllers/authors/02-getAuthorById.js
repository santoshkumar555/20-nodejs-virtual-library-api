import Author from "../../models/Author.js";

export const getAuthorById = async (req, res, next) => {
    try {
        const author = await Author.findById(req.params.id).populate(
            "createdBy",
            "name"
        );
        if (!author)
            return res
                .status(404)
                .json({ success: false, message: "Author not found" });
        res.status(200).json({ success: true, data: author });
    } catch (error) {
        next(error);
    }
};
