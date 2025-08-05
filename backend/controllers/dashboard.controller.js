import User from "../models/user.model.js";
import Hostel from "../models/hostel.model.js";
import Outpass from "../models/outpass.model.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch user to get hostelId and name
    const user = await User.findById(studentId).select("name email hostelId");
    if (!user) return res.status(404).json({ message: "Student not found" });

    // console.log(user);
    const hostel = await Hostel.findById(user.hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    // Find the batch that contains this student
    const batch = hostel.batches.find((batch) =>
      batch.students.includes(studentId.toString())
    );

    // Fetch all outpasses of this student
    const outpasses = await Outpass.find({ student: studentId }).sort({
      createdAt: -1,
    });


    res.status(200).json({
      student: {
        name: user.name,
        email: user.email,
        hostel: {
          _id: hostel._id,
          name: hostel.name,
        },
        batch: batch ? batch.name : "Not assigned",
      },
      outpasses,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const caretakerDashboard = async (req, res) => {
  try {
    const caretakerId = req.user._id;

    // Fetch hostels where the user is a caretaker, and exclude 'admin' from the result
    const hostels = await Hostel.find({ caretakers: caretakerId })
      .select("-admin") // 🟢 exclude the 'admin' field
      .populate("caretakers", "name email") // show caretaker name and email
      .populate({
        path: "batches.students",
        select: "name email photo hostelId", // show specific student fields
      });

    res.status(200).json({
      message: "Caretaker Dashboard",
      hostels,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};