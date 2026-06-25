import Author from "../../models/Author.js";
import Book from "../../models/Book.js";

export const deleteAuthor = async (req, res, next) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author)
            return res
                .status(404)
                .json({ success: false, message: "Author not found" });

        const booksCount = await Book.countDocuments({ author: author._id });
        if (booksCount > 0)
            return res.status(400).json({
                success: false,
                message: "Cannot delete author with existing books",
            });

        await author.deleteOne();
        res.status(200).json({ success: true, message: "Author deleted" });
    } catch (error) {
        next(error);
    }
};
