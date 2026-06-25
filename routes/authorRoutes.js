import express from "express";
const router = express.Router();

import { getAllAuthors } from "../controllers/authors/01-getAllAuthors.js";
import { getAuthorById } from "../controllers/authors/02-getAuthorById.js";
import { createAuthor }  from "../controllers/authors/03-createAuthor.js";
import { updateAuthor }  from "../controllers/authors/04-updateAuthor.js";
import { deleteAuthor }  from "../controllers/authors/05-deleteAuthor.js";

import protect from "../middleware/isUserLoggedIn.js";
import { authorize, checkOwnership } from "../middleware/checkUserPermissions.js";
import Author from "../models/Author.js";

router.post("/", protect, authorize("author", "admin"), createAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.put("/:id", protect, authorize("author", "admin"), checkOwnership(Author), updateAuthor);
router.delete("/:id", protect, authorize("author", "admin"), checkOwnership(Author), deleteAuthor);

export default router;