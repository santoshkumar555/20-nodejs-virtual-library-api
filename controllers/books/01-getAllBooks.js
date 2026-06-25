import Book from "../../models/Book.js";

export const getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find({ isDeleted: false })
            .populate("author", "name bio")
            .populate("createdBy", "name");
        res.status(200).json({
            success: true,
            count: books.length,
            data: books,
        });
    } catch (error) {
        next(error);
    }
};
