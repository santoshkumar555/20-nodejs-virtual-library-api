import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFile = async (filePath) => {
    try {
        const fullPath = path.resolve(filePath);
        if (fs.existsSync(fullPath)) await fs.promises.unlink(fullPath);
    } catch (error) {
        console.error("File cleanup error:", error);
    }
};

export const extractFilename = (imagePath) =>
    imagePath ? imagePath.split("/").pop() : null;

export const getUploadPath = (filename) =>
    path.join(__dirname, "..", "uploads", filename);
