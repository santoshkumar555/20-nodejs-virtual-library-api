import Book from "../../models/Book.js";
import {
    deleteFile,
    extractFilename,
    getUploadPath,
} from "../../utils/deleteUploadedFiles.js";

export const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book)
            return res
                .status(404)
                .json({ success: false, message: "Book not found" });

        await book.deleteOne();
        await deleteFile(getUploadPath(extractFilename(book.coverImage)));

        res.status(200).json({
            success: true,
            message: "Book and image deleted",
        });
    } catch (error) {
        next(error);
    }
};
