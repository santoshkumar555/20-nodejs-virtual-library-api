import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import authRoutes from "./routes/userAccessRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import errorHandler from "./middleware/handleErrors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();

app.use(
    cors({
        origin: true, // Allow all origins in development
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/api/health", (req, res) =>
    res.json({ success: true, message: "API is running" }),
);

app.use("/api/user", authRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
