import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function HostelBatches() {
  const { hostelId } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [newBatchName, setNewBatchName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!hostelId) return;

    const fetchHostel = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/hostels/${hostelId}`, {
          withCredentials: true,
        });
        setHostel(res.data.hostel);
      } catch (err) {
        setError("Failed to load hostel details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);

  // Refresh hostel data after batch update or delete
  const refreshHostel = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/hostels/${hostelId}`, {
        withCredentials: true,
      });
      setHostel(res.data.hostel);
    } catch (err) {
      setError("Failed to reload hostel details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle batch rename submit
  const handleRenameSubmit = async (batchId) => {
    if (!newBatchName.trim()) return alert("Batch name cannot be empty");
    try {
      await axios.put(
        `http://localhost:5000/api/hostels/${hostelId}/batch/${batchId}/rename`,
        { newName: newBatchName },
        { withCredentials: true }
      );
      setEditingBatchId(null);
      setNewBatchName("");
      refreshHostel();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to rename batch");
      console.error(err);
    }
  };

  // Handle batch delete with confirmation
  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/hostels/${hostelId}/batch/${batchId}`,
        { withCredentials: true }
      );
      refreshHostel();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete batch");
      console.error(err);
    }
  };

  if (loading) return <p>Loading hostel details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!hostel) return <p>No hostel found.</p>;

  const batches = hostel.batches || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{hostel.name}</h1>
      <hr className="my-6" />

      {batches.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No batches created yet.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
            onClick={() => navigate(`/hostels/${hostelId}/create-batch`)}
          >
            Create Batch
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Batches</h2>
          <ul className="space-y-4">
            {batches.map((batch) => (
              <li key={batch._id} className="border p-4 rounded shadow flex justify-between items-center">
                <div>
                  {editingBatchId === batch._id ? (
                    <>
                      <input
                        type="text"
                        value={newBatchName}
                        onChange={(e) => setNewBatchName(e.target.value)}
                        className="border rounded px-2 py-1 mr-2"
                        placeholder="New batch name"
                      />
                      <button
                        onClick={() => handleRenameSubmit(batch._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingBatchId(null);
                          setNewBatchName("");
                        }}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-lg">{batch.name}</p>
                      <p className="text-sm text-gray-600">
                        Students: {batch.students ? batch.students.length : 0}
                      </p>
                    </>
                  )}
                </div>

                <div className="space-x-2">
                  {/* View Students button */}
                  <button
                    onClick={() =>
                      navigate(`/hostels/${hostelId}/batch/${batch._id}/students`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    View Students
                  </button>

                  {/* Edit batch button */}
                  {editingBatchId !== batch._id && (
                    <button
                      onClick={() => {
                        setEditingBatchId(batch._id);
                        setNewBatchName(batch.name);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}

                  {/* Delete batch button */}
                  <button
                    onClick={() => handleDeleteBatch(batch._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}