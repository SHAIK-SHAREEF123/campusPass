import Outpass from "../models/outpass.model.js";

export const createOutpass = async (req, res) => {
  // console.log(req.file);
  try {
    const { reason, destination, fromDate, toDate, parentContact } = req.body;

    const outpass = await Outpass.create({
      student: req.user._id,
      reason,
      destination,
      fromDate,
      toDate,
      parentContact,
      photo: `/uploads/outpass_photos/${req.file.filename}`,
    });

    res.status(201).json({
      message: "Outpass request created successfully",
      outpass,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Student: Get all their outpasses
// @route   GET /api/outpasses/my
export const getMyOutpasses = async (req, res) => {
  try {
    // console.log(req.user);
    const outpasses = await Outpass.find({ student: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(outpasses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Admin/Warden: Get all outpasses
// @route   GET /api/outpasses
export const getAllOutpasses = async (req, res) => {
  try {
    const outpasses = await Outpass.find()
      .populate("student", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(outpasses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get single outpass by ID
// @route   GET /api/outpasses/:id
export const getSingleOutpass = async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id).populate(
      "student",
      "name email role"
    );

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    // Students can only view their own outpasses
    if (
      req.user.role === "student" &&
      outpass.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(outpass);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Admin/Warden: Approve or Reject Outpass
// @route   PUT /api/outpasses/:id/status
export const updateOutpassStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected: "approved" or "rejected"

    const outpass = await Outpass.findById(req.params.id);

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (outpass.status !== "pending") {
      return res.status(400).json({ message: "Outpass already processed" });
    }

    outpass.status = status;
    outpass.processedBy = req.user._id;

    await outpass.save();

    res.status(200).json({
      message: `Outpass ${status} successfully`,
      outpass,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Student: Delete pending outpass
// @route   DELETE /api/outpasses/:id
export const deleteOutpass = async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id);

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    // Ensure only the owner (student) can delete it
    if (outpass.student.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this outpass" });
    }

    // Allow delete only if both approvals are still pending
    if (
      outpass.parentApprovalStatus !== "pending" ||
      outpass.wardenStatus !== "pending"
    ) {
      return res.status(400).json({
        message: "Only outpasses with both approvals pending can be deleted",
      });
    }

    await outpass.deleteOne();

    res.status(200).json({ message: "Outpass deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const approveOutpassByParent = async (req, res) => {
  try {
    const { id } = req.params;
    const outpass = await Outpass.findById(id);

    if (!outpass) return res.status(404).json({ message: "Outpass not found" });

    if (outpass.parentApproval !== "pending") {
      return res.status(400).json({ message: "Already reviewed by parent" });
    }

    outpass.parentApproval = "approved";
    await outpass.save();

    res.status(200).json({ message: "Outpass approved by parent", outpass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectOutpassByParent = async (req, res) => {
  try {
    const { id } = req.params;
    const outpass = await Outpass.findById(id);

    if (!outpass) return res.status(404).json({ message: "Outpass not found" });

    if (outpass.parentApproval !== "pending") {
      return res.status(400).json({ message: "Already reviewed by parent" });
    }

    outpass.parentApproval = "rejected";
    await outpass.save();

    res.status(200).json({ message: "Outpass rejected by parent", outpass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveOutpassByCaretaker = async (req, res) => {
  try {
    const { id } = req.params;
    const outpass = await Outpass.findById(id);

    if (!outpass) return res.status(404).json({ message: "Outpass not found" });

    if (outpass.parentApproval !== "approved") {
      return res.status(403).json({ message: "Parent must approve first" });
    }

    if (outpass.caretakerApproval !== "pending") {
      return res.status(400).json({ message: "Already reviewed by caretaker" });
    }

    outpass.caretakerApproval = "approved";
    outpass.processedBy = req.user._id;
    await outpass.save();

    res.status(200).json({ message: "Outpass approved by caretaker", outpass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectOutpassByCaretaker = async (req, res) => {
  try {
    const { id } = req.params;
    const outpass = await Outpass.findById(id);

    if (!outpass) return res.status(404).json({ message: "Outpass not found" });

    if (outpass.parentApproval !== "approved") {
      return res.status(403).json({ message: "Parent must approve first" });
    }

    if (outpass.caretakerApproval !== "pending") {
      return res.status(400).json({ message: "Already reviewed by caretaker" });
    }

    outpass.caretakerApproval = "rejected";
    outpass.processedBy = req.user._id;
    await outpass.save();

    res.status(200).json({ message: "Outpass rejected by caretaker", outpass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Outpass from "../models/Outpass.js";

export const verifyQRCode = async (req, res) => {
  try {
    const { qrCodeData } = req.body; // Expected to be the Outpass ID

    if (!qrCodeData) {
      return res.status(400).json({ message: "QR Code data is required" });
    }

    // Populate 'name' instead of 'fullName' from updated User model
    const outpass = await Outpass.findById(qrCodeData).populate(
      "student",
      "name rollNumber email photo role hostelId"
    );

    if (!outpass) {
      return res.status(404).json({ message: "Invalid or expired QR code" });
    }

    // 1. Check if QR has already been used
    if (outpass.isQRUsed) {
      return res.status(410).json({
        success: false,
        message: "This QR code has already been used",
      });
    }

    // 2. Check if the outpass is approved
    if (outpass.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Outpass is not yet approved or has been rejected",
      });
    }

    // 3. Check for QR expiration (6-hour window from qrGeneratedAt)
    const qrGeneratedAt = outpass.qrGeneratedAt;
    if (!qrGeneratedAt) {
      return res.status(500).json({
        success: false,
        message: "QR code generation timestamp is missing",
      });
    }

    const now = new Date();
    const hoursSinceGenerated = (now - qrGeneratedAt) / (1000 * 60 * 60);

    if (hoursSinceGenerated > 6) {
      return res.status(410).json({
        success: false,
        message: "QR code has expired after 6 hours",
      });
    }

    // ✅ All checks passed — mark as used and log time
    outpass.isQRUsed = true;
    outpass.qrVerifiedAt = now;
    await outpass.save();

    return res.status(200).json({
      success: true,
      message: "Outpass verified successfully",
      outpass: {
        id: outpass._id,
        student: {
          id: outpass.student._id,
          name: outpass.student.name,
          email: outpass.student.email,
          rollNumber: outpass.student.rollNumber,
          role: outpass.student.role,
          photo: outpass.student.photo,
          hostelId: outpass.student.hostelId,
        },
        reason: outpass.reason,
        destination: outpass.destination,
        fromDate: outpass.fromDate,
        toDate: outpass.toDate,
        verifiedAt: now,
      },
    });
  } catch (error) {
    console.error("QR Verification Error:", error);
    res.status(500).json({ message: "Server error while verifying QR code" });
  }
};
