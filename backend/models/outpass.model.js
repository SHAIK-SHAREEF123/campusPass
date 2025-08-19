import mongoose from "mongoose";
import QRCode from "qrcode";

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
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: "Parent contact must be a 10-digit number",
    },
  },

  // Approval statuses
  parentApproval: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  caretakerApproval: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // Final status (auto-calculated)
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // QR-related fields
  qrCode: {
    type: String, // base64 image
    default: null,
  },
  qrGeneratedAt: {
    type: Date,
    default: null,
  },
  isQRUsed: {
    type: Boolean,
    default: false,
  },
  qrVerifiedAt: {
    type: Date,
    default: null,
  },

  // photo: {
  //   type: String,
  //   required: true,
  // },

  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Auto-status update and QR generation
outpassSchema.pre("save", async function (next) {
  if (
    this.parentApproval === "approved" &&
    this.caretakerApproval === "approved"
  ) {
    this.status = "approved";

    // Generate QR only once
    if (!this.qrCode) {
      try {
        const qrData = `outpass:${this._id}`;
        const qrImage = await QRCode.toDataURL(qrData);
        this.qrCode = qrImage;
        this.qrGeneratedAt = new Date(); // Track for expiry
      } catch (err) {
        console.error("QR generation failed:", err);
      }
    }
  } else if (
    this.parentApproval === "rejected" ||
    this.caretakerApproval === "rejected"
  ) {
    this.status = "rejected";
  } else {
    this.status = "pending";
  }

  next();
});

const Outpass = mongoose.model("Outpass", outpassSchema);
export default Outpass;