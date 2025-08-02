import mongoose from "mongoose";
import { maxLength } from "zod";

const outpassSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  parentContact: {
    type: Number,
    required: true,
    maxLength: 10,
  },
  parentApprovalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  wardenStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
    required: true,
  },
});

const Outpass = mongoose.model("Outpass", outpassSchema);

export default Outpass;
