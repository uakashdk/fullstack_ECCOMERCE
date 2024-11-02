import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  console.log("Calling ConnectDB function...");
  try {
    const conn = await mongoose.connect(process.env.DATABASE); // No need for .default()
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDB connection: ${error.message}`);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default ConnectDB;
