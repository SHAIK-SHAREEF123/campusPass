import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - User not found" });
      }

      req.user = user;
      // console.log(req.user);
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Token expired" });
      }
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
