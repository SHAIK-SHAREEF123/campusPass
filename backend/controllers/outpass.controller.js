import Outpass from "../models/outpass.model.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";

// @desc    Create new outpass
export const createOutpass = async (req, res) => {
  try {
    const { reason, destination, fromDate, toDate, parentContact, hostel } =
      req.body;

    if (!hostel) {
      return res.status(400).json({ message: "Hostel is required" });
    }

    const outpass = await Outpass.create({
      student: req.user._id,
      hostel,
      reason,
      destination,
      fromDate,
      toDate,
      parentContact,
    });

    res.status(201).json({
      message: "Outpass request submitted successfully",
      outpass,
    });
  } catch (error) {
    console.error("Error creating outpass:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Student: Get all their outpasses
// controllers/outpassController.js
export const getMyOutpasses = async (req, res) => {
  try {
    const outpasses = await Outpass.find({
      student: req.user._id,
      status: { $in: ["pending", "approved", "rejected"] }, // filter
    })
      .populate("student", "name email")
      .populate("hostel", "name")
      .populate("processedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, outpasses });
  } catch (error) {
    console.error("Error fetching my outpasses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch outpasses",
      error: error.message,
    });
  }
};

// @desc    Admin/Warden: Get all outpasses
export const getAllOutpasses = async (req, res) => {
  try {
    const outpasses = await Outpass.find()
      .populate("student", "name email role")
      .populate("hostel", "name")
      .populate("processedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(outpasses);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch outpasses",
      error: error.message,
    });
  }
};

// @desc    Get single outpass by ID
// controllers/outpassController.js
export const getSingleOutpass = async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id)
      .populate("student", "name email profilePhoto")
      .populate("hostel", "name");

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    // If not logged in (public QR scan)
    if (!req.user) {
      return res.status(200).json({
        student: { name: outpass.student.name },
        hostel: { name: outpass.hostel.name },
        fromDate: outpass.fromDate,
        toDate: outpass.toDate,
        status: outpass.status,
      });
    }

    // If logged in as student but not the owner
    if (req.user.role === "student" && outpass.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this outpass" });
    }

    // Logged-in caretakers, admins, parents, security get full data
    return res.status(200).json(outpass);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Admin/Warden: Approve or Reject Outpass
export const updateOutpassStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected: "approved" or "rejected"
    const outpass = await Outpass.findById(req.params.id).populate(
      "student",
      "name email"
    );

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (outpass.status !== "pending") {
      return res.status(400).json({ message: "Outpass already processed" });
    }

    outpass.caretakerApproval = status;
    outpass.status = status;
    outpass.processedBy = req.user._id;

    await outpass.save();

    const updatedOutpass = await Outpass.findById(outpass._id)
      .populate("student", "name email")
      .populate("hostel", "name")
      .populate("processedBy", "name email");

    //send email
    await sendOutpassNotification(updatedOutpass, status);

    res.status(200).json({
      success: true,
      message: `Outpass ${status} successfully`,
      outpass: updatedOutpass,
    });
  } catch (error) {
    console.error("Error updating outpass status:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Verify QR Code
export const verifyQRCode = async (req, res) => {
  try {
    const { qrCodeData } = req.body;

    if (!qrCodeData) {
      return res.status(400).json({ message: "QR Code data is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(qrCodeData)) {
      return res.status(400).json({ message: "Invalid QR code data" });
    }

    const outpass = await Outpass.findById(qrCodeData).populate(
      "student",
      "name email photo role hostelId"
    );

    if (!outpass) {
      return res.status(404).json({ message: "Invalid or expired QR code" });
    }

    if (outpass.isQRUsed) {
      return res.status(410).json({
        success: false,
        message: "This QR code has already been used",
      });
    }

    if (outpass.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Outpass is not yet approved or has been rejected",
      });
    }

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

//cancel outpass
export const cancelOutpass = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the outpass
    const outpass = await Outpass.findById(id).populate(
      "student",
      "name email"
    );

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    // Ensure only the requesting student can delete their outpass
    if (outpass.student._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this outpass" });
    }

    // Only allow deleting pending ones
    if (outpass.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending outpasses can be cancelled" });
    }

    await sendOutpassNotification(outpass, "cancelled");

    // Delete the outpass from DB
    await Outpass.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Outpass cancelled and removed successfully",
    });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const verifyEntryExit = async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id);
    if (!outpass) return res.status(404).json({ message: "Outpass not found" });

    if (!outpass.exitTime) {
      outpass.exitTime = new Date();
      await outpass.save();
      return res.status(200).json({ message: "Exit recorded successfully", outpass });
    }

    if (!outpass.entryTime) {
      outpass.entryTime = new Date();
      await outpass.save();
      return res.status(200).json({ message: "Entry recorded successfully", outpass });
    }

    return res.status(400).json({ message: "Entry and Exit already recorded" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Email sending

const buildOutpassEmail = (outpass, action) => {
  const getStatusColor = (action) => {
    switch (action) {
      case "approved": return "#10B981"; // green
      case "rejected": return "#EF4444"; // red
      case "cancelled": return "#F59E0B"; // amber
      default: return "#6B7280"; // gray
    }
  };

  const getStatusIcon = (action) => {
    switch (action) {
      case "approved": return "✅";
      case "rejected": return "❌";
      case "cancelled": return "⚠️";
      default: return "📋";
    }
  };

  const statusColor = getStatusColor(action);
  const statusIcon = getStatusIcon(action);
  const actionText = action.charAt(0).toUpperCase() + action.slice(1);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Outpass ${actionText}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; line-height: 1.6; color: #334155;">
      
      <!-- Main Container -->
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc;">
        <tr>
          <td style="padding: 40px 20px;">
            
            <!-- Email Card -->
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden; border-collapse: collapse;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                  <div style="color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 8px;">
                    🎓 CampusPass System
                  </div>
                  <div style="color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
                    Student Outpass Management
                  </div>
                </td>
              </tr>
              
              <!-- Status Banner -->
              <tr>
                <td style="background-color: ${statusColor}; padding: 20px 40px; text-align: center;">
                  <div style="color: #ffffff; font-size: 24px; font-weight: bold;">
                    ${statusIcon} Outpass ${actionText}
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  
                  <!-- Greeting -->
                  <div style="margin-bottom: 30px;">
                    <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 10px 0;">
                      Hi <span style="color: ${statusColor};">${outpass.student?.name}</span>,
                    </h2>
                    <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.5;">
                      Your outpass request has been <strong style="color: ${statusColor};">${actionText.toUpperCase()}</strong> 
                      by <strong>${outpass.processedBy?.name || "System"}</strong>.
                    </p>
                  </div>
                  
                  <!-- Details Card -->
                  <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid ${statusColor};">
                    <h3 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                      📌 Outpass Details
                    </h3>
                    
                    <!-- Details Table -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <strong style="color: #475569; font-size: 14px;">🎯 Destination:</strong>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px;">
                          ${outpass.destination}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <strong style="color: #475569; font-size: 14px;">📝 Reason:</strong>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px;">
                          ${outpass.reason}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <strong style="color: #475569; font-size: 14px;">📅 From Date:</strong>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px;">
                          ${new Date(outpass.fromDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <strong style="color: #475569; font-size: 14px;">📅 To Date:</strong>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px;">
                          ${new Date(outpass.toDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <strong style="color: #475569; font-size: 14px;">🏠 Hostel:</strong>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px;">
                          ${outpass.hostel?.name || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <strong style="color: #475569; font-size: 14px;">📞 Parent Contact:</strong>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px;">
                          ${outpass.parentContact}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <strong style="color: #475569; font-size: 14px;">📊 Status:</strong>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="background-color: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                            ${outpass.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <strong style="color: #475569; font-size: 14px;">👤 Processed By:</strong>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px;">
                          ${outpass.processedBy?.name || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #475569; font-size: 14px;">⏰ Processed At:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                          ${new Date(outpass.updatedAt || outpass.createdAt).toLocaleString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- QR Code Section -->
                  ${outpass.qrCode ? `
                    <div style="text-align: center; background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 2px dashed ${statusColor};">
                      <h3 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">
                        🎟️ Your QR Code
                      </h3>
                      <div style="display: inline-block; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <img src="${outpass.qrCode}" alt="Outpass QR Code" style="max-width: 200px; height: auto; display: block;">
                      </div>
                      <p style="color: #64748b; font-size: 14px; margin: 15px 0 0 0; font-style: italic;">
                        Present this QR code when entering/exiting the campus
                      </p>
                    </div>
                  ` : `
                    <div style="text-align: center; background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
                      <div style="color: #92400e; font-size: 16px; font-weight: 500;">
                        ⏳ QR code will be generated shortly
                      </div>
                    </div>
                  `}
                  
                  <!-- Call to Action -->
                  ${action === 'approved' ? `
                    <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); display: inline-block; padding: 15px 30px; border-radius: 8px; text-decoration: none; color: white; font-weight: 600; font-size: 16px;">
                        🎉 Your outpass is ready to use!
                      </div>
                    </div>
                  ` : action === 'rejected' ? `
                    <div style="text-align: center; margin-bottom: 30px; background-color: #fef2f2; border-radius: 8px; padding: 20px; border-left: 4px solid #ef4444;">
                      <div style="color: #dc2626; font-size: 16px; font-weight: 500;">
                        📞 For queries, please contact the hostel administration
                      </div>
                    </div>
                  ` : ''}
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <div style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
                    Best regards,<br>
                    <strong style="color: #1e293b;">CampusPass System</strong>
                  </div>
                  <div style="color: #94a3b8; font-size: 12px; line-height: 1.4;">
                    This is an automated message. Please do not reply to this email.<br>
                    For support, contact your hostel administration.
                  </div>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;
};

export const sendOutpassNotification = async (outpass, action) => {
  if (!outpass?.student?.email) return;

  const subject = `Outpass ${action.charAt(0).toUpperCase() + action.slice(1)} - ${outpass.student.name}`;

  let attachments = [];
  let html = buildOutpassEmail(outpass, action);

  if (outpass.qrCode?.startsWith("data:image")) {
    // Attach QR as inline image
    const base64Data = outpass.qrCode.split(";base64,").pop();
    attachments.push({
      filename: "qrcode.png",
      content: Buffer.from(base64Data, "base64"),
      cid: "qrcode@campuspass" // same CID used in HTML
    });

    // Replace <img src="..."> with CID
    html = html.replace(outpass.qrCode, "cid:qrcode@campuspass");
  }

  await sendEmail(outpass.student.email, subject, html, attachments);
};
