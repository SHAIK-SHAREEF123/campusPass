import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateHostel() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Hostel name is required");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/hostels/create",
        { name },
        { withCredentials: true }
      );
      toast.success(data.message || "Hostel created successfully");
      navigate("/hostels");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create hostel");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Hostel</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700">
              Hostel Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter hostel name"
              className="w-full p-3 mt-1 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
          >
            Create Hostel
          </button>
        </form>
      </div>
    </div>
  );
}
