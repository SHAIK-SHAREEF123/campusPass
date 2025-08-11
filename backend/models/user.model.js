  import mongoose from "mongoose";
  import bcrypt from "bcryptjs";

  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String }, // Optional for Google users
      isGoogleUser: { type: Boolean, default: false },
      role: {
        type: String,
        enum: ["student", "parent", "caretaker", "admin"],
        default: "student",
      },
      profilePhoto: { type: String, default: "" },

      // 🔽 Add hostel reference here
      hostelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
        required: function () {
          return ["student", "caretaker"].includes(this.role);
        },
      },
    },
    { timestamps: true }
  );

  // Hash password before saving, only if modified
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

  // Instance method to compare password
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  export default mongoose.model("User", userSchema);