export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // this also sanitizes data
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors.map((e) => e.message),
    });
  }
};
