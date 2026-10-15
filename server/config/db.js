const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/complaintDB";
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Warning:", err.message);
    console.log(
      "Note: If your MongoDB Atlas cluster was paused due to inactivity, resume it in the MongoDB Atlas console or check your internet/DNS connection."
    );
  }
};

module.exports = connectDB;