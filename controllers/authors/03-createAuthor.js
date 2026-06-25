import Author from "../../models/Author.js";

export const createAuthor = async (req, res, next) => {
    try {
        const author = await Author.create({
            ...req.body,
            createdBy: req.user.id,
        });
        res.status(201).json({ success: true, data: author });
    } catch (error) {
        next(error);
    }
};
