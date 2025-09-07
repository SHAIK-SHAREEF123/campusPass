import mongoose from "mongoose";
import QRCode from "qrcode";

const outpassSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
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

  caretakerApproval: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

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
  entryTime: {
    type: Date,
  },
  exitTime: {
    type: Date,
  },

  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Auto-status update and QR generation
outpassSchema.pre("save", async function (next) {
  if (this.caretakerApproval === "approved") {
    this.status = "approved";

    // Generate QR only once
    if (!this.qrCode) {
      try {
        // Instead of plain ID, generate a full frontend link
        const qrData = `${process.env.CLIENT_URL}/outpass/${this._id}`;
        const qrImage = await QRCode.toDataURL(qrData);
        this.qrCode = qrImage;
        this.qrGeneratedAt = new Date(); // Track for expiry
      } catch (err) {
        console.error("QR generation failed:", err);
      }
    }
  } else if (this.caretakerApproval === "rejected") {
    this.status = "rejected";
  } else {
    this.status = "pending";
  }

  next();
});

const Outpass = mongoose.model("Outpass", outpassSchema);
export default Outpass;
