import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caretakers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    batches: [
      {
        name: {
          type: String,
          required: true, // e.g., R20, R21
          trim: true,
        },
        students: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Students in this batch
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Hostel = mongoose.model("Hostel", hostelSchema);

export default Hostel;
