import Hostel from "../models/hostel.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Create a new hostel
export const createHostel = async (req, res) => {
  try {
    const { name } = req.body;
    // console.log(name);
    
    const existingHostel = await Hostel.findOne({ name });
    if (existingHostel) {
      return res.status(400).json({ message: "Hostel name already exists" });
    }

    const hostel = await Hostel.create({
      name,
      admin: req.user._id,
    });

    res.status(201).json({ message: "Hostel created", hostel });
  } catch (error) {
    res.status(500).json({ message: "Error creating hostel", error });
  }
};

// Assign a caretaker to a hostel
export const assignCaretakerToHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { caretakerId } = req.body;

    const caretaker = await User.findById(caretakerId);
    if (!caretaker || caretaker.role !== "caretaker") {
      return res.status(400).json({ message: "Invalid caretaker" });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (!hostel.caretakers.includes(caretakerId)) {
      hostel.caretakers.push(caretakerId);
      await hostel.save();
    }

    res.status(200).json({ message: "Caretaker assigned", hostel });
  } catch (error) {
    res.status(500).json({ message: "Error assigning caretaker", error });
  }
};

// Get all hostels (Admin only)
export const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find()
      .populate("admin", "name email")
      .populate("caretakers", "name email");

    res.status(200).json({ hostels });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hostels", error });
  }
};

// Get a single hostel by ID (role-specific access)
export const getHostelById = async (req, res) => {
  // console.log("req.params:", req.params);

  try {
    const { hostelId } = req.params;

    const hostel = await Hostel.findById(hostelId)
      .populate("admin", "name email")
      .populate("caretakers", "-password")
      .populate("batches.students", "-password");

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // Send full hostel details including batches
    return res.status(200).json({ hostel });
  } catch (error) {
    console.error("Error in getHostelById:", error);
    res.status(500).json({ message: "Server error." });
  }
};


// controller method
export const createBatchInHostel = async (req, res) => {
  const { hostelId } = req.params;
  const { name } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (!name)
    return res.status(400).json({ message: "Batch name is required." });

  try {
    const hostel = await Hostel.findById(hostelId);

    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    // Allow if user is admin OR caretaker assigned to this hostel
    const isCaretaker = hostel.caretakers.some((caretakerId) =>
      caretakerId.equals(userId)
    );

    if (!(userRole === "admin" || isCaretaker)) {
      return res
        .status(403)
        .json({ message: "Not authorized to create batch in this hostel" });
    }

    // Check for duplicate batch name
    const existingBatch = hostel.batches.find(
      (batch) => batch.name.toLowerCase() === name.toLowerCase()
    );
    if (existingBatch)
      return res
        .status(400)
        .json({ message: "Batch with this name already exists" });

    // Add new batch
    hostel.batches.push({ name, students: [] });
    await hostel.save();

    res
      .status(201)
      .json({ message: `Batch '${name}' created successfully`, batch: name });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addStudentToBatch = async (req, res) => {
  const { hostelId, batchId } = req.params;
  const { email } = req.body;
  const userId = req.user._id;

  if (!email) return res.status(400).json({ message: "Student email is required" });

  try {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    const isCaretaker = hostel.caretakers.includes(userId.toString()) || req.user.role === "admin";
    if (!isCaretaker)
      return res.status(403).json({ message: "Not authorized to add student to this hostel" });

    const batch = hostel.batches.id(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    const student = await User.findOne({ email, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (batch.students.includes(student._id))
      return res.status(400).json({ message: "Student already in this batch" });

    batch.students.push(student._id);
    await hostel.save();

    student.hostelId = hostelId;
    await student.save();

    res.status(200).json({ message: "Student added successfully", student });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const renameBatch = async (req, res) => {
  const { hostelId, batchId } = req.params;
  const { newName } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (!newName) {
    return res.status(400).json({ message: "New batch name is required" });
  }

  try {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    // Allow if admin or caretaker assigned to hostel
    const isCaretaker = hostel.caretakers.some((id) => id.equals(userId));
    if (!(userRole === "admin" || isCaretaker)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const batch = hostel.batches.id(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.name = newName;
    await hostel.save();

    res.status(200).json({ message: "Batch renamed successfully", batch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteBatch = async (req, res) => {
  const { hostelId, batchId } = req.params;

  const hostel = await Hostel.findById(hostelId);

  if (!hostel) {
    return res.status(404).json({ message: "Hostel not found" });
  }

  // Allow if user is admin OR assigned caretaker
  const isCaretaker = hostel.caretakers.some(
    (caretakerId) => caretakerId.equals(req.user._id)
  );

  if (!(req.user.role === "admin" || isCaretaker)) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete batches from this hostel" });
  }

  const batchIndex = hostel.batches.findIndex(
    (batch) => batch._id.toString() === batchId
  );

  if (batchIndex === -1) {
    return res.status(404).json({ message: "Batch not found" });
  }

  hostel.batches.splice(batchIndex, 1); // Remove batch from array
  await hostel.save();

  res.status(200).json({ message: "Batch deleted successfully" });
};

export const getStudentsInBatch = async (req, res) => {
  const { hostelId, batchId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role; // assuming role is set in auth middleware

  try {
    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // Find the batch by ID
    const batch = hostel.batches.id(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Authorization
    const isCaretaker = hostel.caretakers.some((id) => id.equals(userId));
    const isAdmin = userRole === "admin" || userRole === "superadmin";
    const isStudentInBatch = batch.students.some((id) => id.equals(userId));

    if (!(isCaretaker || isAdmin || isStudentInBatch)) {
      return res.status(403).json({
        message: "Not authorized to access this batch's students",
      });
    }

    // Populate student details
    const students = await User.find({
      _id: { $in: batch.students },
    }).select("-password");

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error in getStudentsInBatchById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const removeStudentFromBatch = async (req, res) => {
  const { hostelId, batchId, studentId } = req.params;
  const userId = req.user._id;

  try {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    // Allow caretaker assigned to this hostel OR admin
    const isAuthorized =
      hostel.caretakers.includes(userId.toString()) || req.user.role === "admin";
    if (!isAuthorized)
      return res
        .status(403)
        .json({ message: "Not authorized to modify this hostel's batches" });

    // Find batch by ID
    const batch = hostel.batches.id(batchId);
    if (!batch)
      return res.status(404).json({ message: "Batch not found" });

    const index = batch.students.findIndex(
      (id) => id.toString() === studentId
    );
    if (index === -1)
      return res
        .status(404)
        .json({ message: "Student not found in this batch" });

    batch.students.splice(index, 1); // remove student
    await hostel.save();

    res
      .status(200)
      .json({ message: "Student removed from batch successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

