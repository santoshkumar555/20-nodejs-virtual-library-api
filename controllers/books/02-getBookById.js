import Book from "../../models/Book.js";

export const getBookById = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, isDeleted: false })
            .populate("author", "name bio")
            .populate("createdBy", "name");
        if (!book)
            return res
                .status(404)
                .json({ success: false, message: "Book not found" });
        res.status(200).json({ success: true, data: book });
    } catch (error) {
        next(error);
    }
};
