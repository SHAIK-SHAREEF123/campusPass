import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    password: "",
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData((fd) => ({ ...fd, profilePhoto: files[0] }));
    } else {
      setFormData((fd) => ({ ...fd, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      if (formData.password.trim()) {
        formPayload.append("password", formData.password.trim());
      }
      if (formData.profilePhoto) {
        formPayload.append("profilePhoto", formData.profilePhoto);
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile/update",
        formPayload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(setUser(response.data.user));
      toast.success(response.data.message || "Profile updated successfully");
      navigate("/profile");
      setFormData((fd) => ({ ...fd, password: "", profilePhoto: null }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        encType="multipart/form-data"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Email (disabled) */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Email</label>
          <input
            name="email"
            value={user?.email || ""}
            disabled
            className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md cursor-not-allowed"
          />
        </div>

        {/* Role (disabled) */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Role</label>
          <input
            name="role"
            value={user?.role || ""}
            disabled
            className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Leave blank to keep current"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Profile Photo Upload */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Profile Photo
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={user?.profilePhoto || "/default-profile.png"}
              alt="Profile Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-400"
            />
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="text-sm text-gray-600"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-md transition-colors duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
