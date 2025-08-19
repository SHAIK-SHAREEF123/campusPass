// src/pages/CreateBatch.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateBatch() {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [batchName, setBatchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchName.trim()) {
      setError("Batch name cannot be empty");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Your backend API route for creating batch inside hostel
      const res = await axios.post(
        `http://localhost:5000/api/hostels/${hostelId}/create-batch`,
        { name: batchName },
        { withCredentials: true }
      );
      // Success — navigate back to hostel batches page
      navigate(`/hostels/${hostelId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create batch");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Batch</h1>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium" htmlFor="batchName">
          Batch Name
        </label>
        <input
          id="batchName"
          type="text"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          disabled={loading}
          autoFocus
          placeholder="Enter batch name"
        />

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {loading ? "Creating..." : "Create Batch"}
        </button>
      </form>
    </div>
  );
}
