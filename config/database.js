import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        if (process.env.NODE_ENV === "development") {
            console.log(
                `MongoDB connected → ${await mongoose.connection.host}`,
            );
        } else {
            console.log(`Database connected successfully`);
        }
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
