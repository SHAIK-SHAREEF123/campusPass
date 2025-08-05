import Hostel from "../models/hostel.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Create a new hostel
export const createHostel = async (req, res) => {
  try {
    const { name } = req.body;

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
  try {
    const { hostelId } = req.params;
    const user = req.user;

    const hostel = await Hostel.findById(hostelId)
      .populate("admin", "name email")
      .populate("caretakers", "-password")
      .populate("batches.students", "-password");

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (user.role === "admin") {
      return res.status(200).json({ hostel });
    }

    if (user.role === "caretaker") {
      const isAssigned = hostel.caretakers.some(
        (c) => c._id.toString() === user._id.toString()
      );

      if (!isAssigned) {
        return res.status(403).json({ message: "Not assigned to this hostel" });
      }

      return res.status(200).json({
        hostel: {
          _id: hostel._id,
          name: hostel.name,
          batches: hostel.batches.map((batch) => ({
            name: batch.name,
            students: batch.students,
          })),
        },
      });
    }

    if (user.role === "student") {
      let isStudentInHostel = false;
      const otherStudents = [];

      hostel.batches.forEach((batch) => {
        batch.students.forEach((student) => {
          if (student._id.toString() === user._id.toString()) {
            isStudentInHostel = true;
          } else {
            otherStudents.push(student);
          }
        });
      });

      if (!isStudentInHostel) {
        return res
          .status(403)
          .json({ message: "You are not part of this hostel" });
      }

      return res.status(200).json({
        hostel: {
          _id: hostel._id,
          name: hostel.name,
          otherStudents,
        },
      });
    }

    return res.status(403).json({ message: "Access denied." });
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

  if (!name)
    return res.status(400).json({ message: "Batch name is required." });

  try {
    const hostel = await Hostel.findById(hostelId);

    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    // Check if user is assigned caretaker
    const isCaretaker = hostel.caretakers.some((caretakerId) =>
      caretakerId.equals(userId)
    );
    if (!isCaretaker)
      return res
        .status(403)
        .json({ message: "Not authorized to create batch in this hostel" });

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
  const { hostelId, batchName } = req.params;
  const { studentId } = req.body;
  const userId = req.user._id;

  if (!studentId)
    return res.status(400).json({ message: "Student ID is required" });

  try {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    // Check caretaker access
    const isCaretaker = hostel.caretakers.includes(userId.toString());
    if (!isCaretaker)
      return res
        .status(403)
        .json({ message: "Not authorized to add student to this hostel" });

    // Find batch by name (case insensitive)
    const batch = hostel.batches.find(
      (b) => b.name.toLowerCase() === batchName.toLowerCase()
    );
    if (!batch)
      return res
        .status(404)
        .json({ message: `Batch '${batchName}' not found` });

    // Prevent duplicate
    if (batch.students.includes(studentId))
      return res.status(400).json({ message: "Student already in this batch" });

    // Add student to batch
    batch.students.push(studentId);
    await hostel.save();

    // Update student's hostelId in User model
    const student = await User.findById(studentId);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    student.hostelId = hostelId; // Assign hostelId to student
    await student.save();

    res
      .status(200)
      .json({ message: `Student added to '${batch.name}' successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const renameBatch = async (req, res) => {
  const { hostelId, batchId } = req.params;
  const { newName } = req.body;
  const userId = req.user._id;

  if (!newName) {
    return res.status(400).json({ message: "New batch name is required" });
  }

  try {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    const isCaretaker = hostel.caretakers.includes(userId.toString());
    if (!isCaretaker)
      return res.status(403).json({ message: "Not authorized" });

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

  // Check if user is caretaker of this hostel
  const isCaretaker = hostel.caretakers.includes(req.user._id);
  if (!isCaretaker && req.user.role !== "caretaker") {
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
  const { hostelId, batchName } = req.params;
  const userId = req.user._id;

  try {
    const hostel = await Hostel.findById(hostelId);

    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    // Check if caretaker is assigned to this hostel
    const isCaretaker = hostel.caretakers.includes(userId.toString());
    if (!isCaretaker)
      return res
        .status(403)
        .json({ message: "Not authorized to access this hostel's students" });

    const batch = hostel.batches.find(
      (b) => b.name.toLowerCase() === batchName.toLowerCase()
    );

    if (!batch)
      return res
        .status(404)
        .json({ message: `Batch '${batchName}' not found` });

    // Populate student details
    const students = await User.find({
      _id: { $in: batch.students.map((id) => new mongoose.Types.ObjectId(id)) },
    }).select("-password");

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeStudentFromBatch = async (req, res) => {
  const { hostelId, batchName, studentId } = req.params;
  const userId = req.user._id;

  try {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    // Check if caretaker is assigned to this hostel
    const isCaretaker = hostel.caretakers.includes(userId.toString());
    if (!isCaretaker)
      return res
        .status(403)
        .json({ message: "Not authorized to modify this hostel's batches" });

    const batch = hostel.batches.find(
      (b) => b.name.toLowerCase() === batchName.toLowerCase()
    );
    if (!batch)
      return res
        .status(404)
        .json({ message: `Batch '${batchName}' not found` });

    const index = batch.students.indexOf(studentId);
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
