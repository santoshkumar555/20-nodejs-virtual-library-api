import Author from "../../models/Author.js";

export const getAllAuthors = async (req, res, next) => {
    try {
        const authors = await Author.find().populate("createdBy", "name email");
        res.status(200).json({
            success: true,
            count: authors.length,
            data: authors,
        });
    } catch (error) {
        next(error);
    }
};
