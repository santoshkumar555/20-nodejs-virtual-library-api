import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Book title is required"],
            trim: true,
        },
        description: { type: String, trim: true },
        isbn: { type: String, trim: true, unique: true, sparse: true },
        genre: {
            type: String,
            enum: [
                "Fiction",
                "Non-Fiction",
                "Sci-Fi",
                "Fantasy",
                "Mystery",
                "Other",
            ],
        },
        coverImage: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model("Book", bookSchema);
