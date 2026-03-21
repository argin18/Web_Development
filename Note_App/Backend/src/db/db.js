const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MongoDB URI is not defined");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Failed to connect Database.", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected.");
});

module.exports = connectDB;
