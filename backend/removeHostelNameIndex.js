// removeHostelNameIndex.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const removeIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const result = await mongoose.connection.db
      .collection("hostels")
      .dropIndex("hostelName_1");
    console.log("Index dropped:", result);

    process.exit();
  } catch (error) {
    console.error("⚠️ Error removing index:", error.message);
    process.exit(1);
  }
};

removeIndex();
