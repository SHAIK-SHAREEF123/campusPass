import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

  const { user } = useSelector((state) => state.auth);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-semibold text-xl animate-pulse">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-200 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Not Found</h2>
          <p className="text-gray-600 text-lg">No hostel found.</p>
        </div>
      </div>
    );
  }

  const batches = hostel.batches || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  {hostel.name}
                </h1>
                <p className="text-slate-600 text-lg mt-2">Manage batches and students</p>
              </div>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mt-6"></div>
        </div>

        {/* Content Section */}
        {batches.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">No Batches Created</h2>
                <p className="text-xl text-slate-600 leading-relaxed mb-8">
                  Start organizing your hostel by creating the first batch. Batches help you manage students more effectively.
                </p>
              </div>

              {user?.role === "admin" || user?.role === "caretaker" ? (
                <button
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  onClick={() => navigate(`/hostels/${hostelId}/create-batch`)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></span>
                  <span className="relative flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Batch
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Batches Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Batches</h2>
                <p className="text-slate-600 mt-2">Manage and organize student groups</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500 bg-white/50 px-4 py-2 rounded-xl">
                  {batches.length} batch{batches.length !== 1 ? 'es' : ''}
                </div>

                {(user?.role === "admin" || user?.role === "caretaker") && (
                  <button
                    onClick={() => navigate(`/hostels/${hostelId}/create-batch`)}
                    className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
                    <span className="relative flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Batch
                    </span>
                  </button>
                )}

                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate(`/hostels/${hostelId}/assign-caretaker`)}
                    className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
                    <span className="relative flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Assign Caretaker
                    </span>
                  </button>

                )}

                {user.role === "admin" && (<button
                  onClick={() => navigate(`/hostels/${hostelId}/remove-caretaker`)}
                  className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
                  <span className="relative flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Remove Caretaker
                  </span>
                </button>
                )}

              </div>
            </div>

            {/* Batches Grid */}
            <div className="grid gap-6">
              {batches.map((batch, index) => (
                <div
                  key={batch._id}
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Batch Info */}
                      <div className="flex-1">
                        {editingBatchId === batch._id ? (
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                type="text"
                                value={newBatchName}
                                onChange={(e) => setNewBatchName(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg font-medium"
                                placeholder="Enter new batch name"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRenameSubmit(batch._id)}
                                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingBatchId(null);
                                    setNewBatchName("");
                                  }}
                                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                                {batch.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-2">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-slate-600 font-medium">
                                  {batch.students ? batch.students.length : 0} students
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* View Students Button */}
                        <button
                          onClick={() =>
                            navigate(`/hostels/${hostelId}/batch/${batch._id}/students`)
                          }
                          className="group/btn relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex-1 sm:flex-none"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl blur opacity-30 group-hover/btn:opacity-50 transition-opacity"></span>
                          <span className="relative flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="hidden sm:inline">View Students</span>
                            <span className="sm:hidden">Students</span>
                          </span>
                        </button>

                        <div className="flex gap-3">

                          {(user?.role === "admin" || user?.role === "caretaker") && editingBatchId !== batch._id && (
                            <button
                              onClick={() => {
                                setEditingBatchId(batch._id);
                                setNewBatchName(batch.name);
                              }}
                              className="inline-flex items-center justify-center px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                              title="Edit batch name"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                          )}

                          {(user?.role === "admin" || user?.role === "caretaker") && (
                            <button
                              onClick={() => handleDeleteBatch(batch._id)}
                              className="inline-flex items-center justify-center px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                              title="Delete batch"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}