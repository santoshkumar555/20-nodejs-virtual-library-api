import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "author", "admin"],
            default: "user",
        },
        loginOtp: {
            type: String,
            select: false,
        },
        loginOtpExpire: {
            type: Date,
            select: false,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export default mongoose.model("User", userSchema);
