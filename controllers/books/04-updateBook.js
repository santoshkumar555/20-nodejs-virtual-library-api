import Book from "../../models/Book.js";
import {
    deleteFile,
    extractFilename,
    getUploadPath,
} from "../../utils/deleteUploadedFiles.js";
import { sanitizeInput } from "../../utils/validateInput.js";

export const updateBook = async (req, res, next) => {
    try {
        let book = await Book.findById(req.params.id);
        if (!book)
            return res
                .status(404)
                .json({ success: false, message: "Book not found" });

        if (req.file) {
            await deleteFile(getUploadPath(extractFilename(book.coverImage)));
            req.body.coverImage = `/uploads/${req.file.filename}`;
        }

        if (req.body.title) req.body.title = sanitizeInput(req.body.title);
        if (req.body.description)
            req.body.description = sanitizeInput(req.body.description);

        book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate([
            { path: "author", select: "name bio" },
            { path: "createdBy", select: "name" },
        ]);

        res.status(200).json({ success: true, data: book });
    } catch (error) {
        if (req.file) await deleteFile(getUploadPath(req.file.filename));
        next(error);
    }
};
