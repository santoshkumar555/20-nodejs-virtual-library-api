import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Author name is required"],
            trim: true,
        },
        bio: { type: String, trim: true },
        birthdate: { type: Date },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model("Author", authorSchema);
