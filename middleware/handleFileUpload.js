import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
        cb(null, `book-${Date.now()}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    allowed.includes(path.extname(file.originalname).toLowerCase())
        ? cb(null, true)
        : cb(new Error("Only images allowed"), false);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
