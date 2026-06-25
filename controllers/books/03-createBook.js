import Book from "../../models/Book.js";
import Author from "../../models/Author.js";
import { deleteFile, getUploadPath } from "../../utils/deleteUploadedFiles.js";
import { sanitizeInput } from "../../utils/validateInput.js";

export const createBook = async (req, res, next) => {
    try {
        if (!req.file)
            return res
                .status(400)
                .json({ success: false, message: "Please upload an image" });

        if (!req.body.author)
            return res
                .status(400)
                .json({ success: false, message: "Author ID is required" });

        const authorExists = await Author.findById(req.body.author);
        if (!authorExists) {
            await deleteFile(getUploadPath(req.file.filename));
            return res
                .status(404)
                .json({ success: false, message: "Author not found" });
        }

        const book = await Book.create({
            title: sanitizeInput(req.body.title),
            description: sanitizeInput(req.body.description),
            genre: req.body.genre,
            isbn: req.body.isbn,
            author: req.body.author,
            coverImage: `/uploads/${req.file.filename}`,
            createdBy: req.user.id,
        });

        const populatedBook = await book.populate([
            { path: "author", select: "name bio" },
            { path: "createdBy", select: "name" },
        ]);

        res.status(201).json({ success: true, data: populatedBook });
    } catch (error) {
        if (req.file) await deleteFile(getUploadPath(req.file.filename));
        next(error);
    }
};
