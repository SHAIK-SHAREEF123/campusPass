import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const setToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,           
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24,
  });
};


// REGISTER
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  // console.log(req.body);
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // 🔹 Check if trying to create another admin
    if (role === "admin") {
      const adminExists = await User.findOne({ role: "admin" });
      if (adminExists) {
        return res
          .status(400)
          .json({ message: "There should be only one admin" });
      }
    }

    // Cloudinary photo URL from multer storage
    const profilePhoto = req.file ? req.file.path : "";

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
      isGoogleUser: false,
      profilePhoto, // store Cloudinary URL here
    });

    // Generate and set token
    const token = generateToken(user._id);
    setToken(res, token);

    // Respond with user data
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      token,
    });
  } catch (error) {
    console.error("Error in register controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  // console.log("Poor Login : ");
  const { email, password } = req.body;
  // console.log(email);

  try {
    const user = await User.findOne({ email });

    // console.log(user);

    if (!user || user.isGoogleUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    setToken(res, token);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      token,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// GOOGLE LOGIN
export const googleLogin = async (req, res) => {
  const { tokenId, role } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        isGoogleUser: true,
      });
    }

    const token = generateToken(user._id);
    setToken(res, token);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Google login failed:", error.message);
    res.status(400).json({ message: "Invalid Google token" });
  }
};

// LOGOUT
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};


// GET MY PROFILE
// export const getMyProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to get profile", error: error.message });
//   }
// };

// UPDATE MY PROFILE
export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, password } = req.body;

    if (name) user.name = name;
    if (password) user.password = password; // hashed on save if you have middleware

    // If Cloudinary upload succeeded
    if (req.file && req.file.path) {
      user.profilePhoto = req.file.path; // Cloudinary URL
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

