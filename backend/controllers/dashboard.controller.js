import User from "../models/user.model.js";
import Hostel from "../models/hostel.model.js";
import Outpass from "../models/outpass.model.js";

// ---------------- Student Dashboard ----------------
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch student details
    const user = await User.findById(studentId).select(
      "name email profilePhoto hostelId"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Fetch hostel
    const hostel = await Hostel.findById(user.hostelId);
    if (!hostel) {
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found" });
    }

    // Find batch of the student
    const batch = hostel.batches.find((batch) =>
      batch.students.includes(studentId.toString())
    );

    // Fetch student's outpasses
    const outpasses = await Outpass.find({ student: studentId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      student: {
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        hostel: {
          _id: hostel._id,
          name: hostel.name,
        },
        batch: batch ? batch.name : "Not assigned",
      },
      outpasses,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ---------------- Caretaker Dashboard ----------------
export const getCaretakerDashboard = async (req, res) => {
  try {
    const caretakerId = req.user._id;

    // Get hostels assigned to caretaker
    const hostels = await Hostel.find({ caretakers: caretakerId })
      .populate("caretakers", "name email")
      .populate({
        path: "batches.students",
        select: "name email profilePhoto hostelId",
      });

    if (!hostels.length) {
      return res.status(200).json({
        success: true,
        message: "No hostels assigned",
        hostels: [],
        outpasses: [],
        stats: { approvedCount: 0, pendingCount: 0, rejectedCount: 0 },
      });
    }

    // Collect studentIds of all hostels
    const studentIds = hostels.flatMap((hostel) =>
      hostel.batches.flatMap((batch) => batch.students.map((s) => s._id))
    );

    // Fetch outpasses of those students
    const outpasses = await Outpass.find({ student: { $in: studentIds } })
      .populate("student", "name email hostelId profilePhoto")
      .sort({ createdAt: -1 });

    // Stats
    const approvedCount = outpasses.filter(
      (o) => o.status === "approved"
    ).length;
    const pendingCount = outpasses.filter((o) => o.status === "pending").length;
    const rejectedCount = outpasses.filter(
      (o) => o.status === "rejected"
    ).length;

    res.status(200).json({
      success: true,
      message: "Caretaker Dashboard",
      hostels,
      outpasses,
      stats: { approvedCount, pendingCount, rejectedCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    // Counts
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCaretakers = await User.countDocuments({ role: "caretaker" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalHostels = await Hostel.countDocuments();
    const totalOutpasses = await Outpass.countDocuments();

    // Outpass status counts
    const pendingOutpasses = await Outpass.countDocuments({ status: "pending" });
    const approvedOutpasses = await Outpass.countDocuments({ status: "approved" });
    const rejectedOutpasses = await Outpass.countDocuments({ status: "rejected" });

    // ✅ Get recent 5 outpasses with student info
    const recentOutpasses = await Outpass.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalCaretakers,
        totalAdmins,
        totalHostels,
        totalOutpasses,
        pendingOutpasses,
        approvedOutpasses,
        rejectedOutpasses,
        recentOutpasses,
      },
    });
  } catch (error) {
    console.error("Error in getAdminDashboard:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

