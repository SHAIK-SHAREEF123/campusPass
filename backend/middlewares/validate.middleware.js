export const validate = (schema) => (req, res, next) => {
  try {
    // console.log("Incoming body before validation:", req.body);
    req.body = schema.parse(req.body); // sanitizes
    next();
  } catch (error) {
    console.error("Validation failed:", error.errors || error.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors || error.message
    });
  }
};
