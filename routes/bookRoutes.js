import express from "express";
const router = express.Router();

import { getAllBooks } from "../controllers/books/01-getAllBooks.js";
import { getBookById } from "../controllers/books/02-getBookById.js";
import { createBook }  from "../controllers/books/03-createBook.js";
import { updateBook }  from "../controllers/books/04-updateBook.js";
import { deleteBook }  from "../controllers/books/05-deleteBook.js";

import protect from "../middleware/isUserLoggedIn.js";
import { authorize, checkOwnership } from "../middleware/checkUserPermissions.js";
import upload from "../middleware/handleFileUpload.js";
import Book from "../models/Book.js";

router.post("/", protect, authorize("author", "admin"), upload.single("coverImage"), createBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", protect, authorize("author", "admin"), checkOwnership(Book), upload.single("coverImage"), updateBook);
router.delete("/:id", protect, authorize("author", "admin"), checkOwnership(Book), deleteBook);

export default router;