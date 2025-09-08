import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../utils/axiosInstance";

const AllOutpassesPage = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // Fetch caretaker-specific outpasses
  const fetchOutpasses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/outpass", {
        withCredentials: true,
      });
      setOutpasses(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load outpasses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutpasses();
  }, []);

  // Update caretaker approval
  const handleCaretakerDecision = async (id, decision) => {
    try {
      setProcessingId(id);

      await API.put(
        `/outpass/${id}/status`,
        { status: decision }, // approved / rejected
        { withCredentials: true }
      );

      fetchOutpasses();
      toast.success(`Outpass ${decision} successfully!`);
    } catch (err) {
      console.error("Error updating outpass status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-300">Loading outpasses...</div>;
  if (error) return <div className="p-6 text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/30 p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-8">
          Student Outpass Requests
        </h1>

        {outpasses.length === 0 ? (
          <p className="text-center text-gray-400">No outpasses found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-gray-200 text-sm">
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Hostel</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Destination</th>
                  <th className="p-3 text-left">From</th>
                  <th className="p-3 text-left">To</th>
                  <th className="p-3 text-left">Caretaker Approval</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {outpasses.map((op) => (
                  <tr
                    key={op._id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-3 text-gray-100">{op.student?.name}</td>
                    <td className="p-3 text-gray-100">{op.hostel?.name || "N/A"}</td>
                    <td className="p-3 text-gray-100">{op.reason}</td>
                    <td className="p-3 text-gray-100">{op.destination}</td>
                    <td className="p-3 text-gray-300">
                      {new Date(op.fromDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-300">
                      {new Date(op.toDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          op.caretakerApproval === "approved"
                            ? "bg-green-500/20 text-green-400"
                            : op.caretakerApproval === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {op.caretakerApproval}
                      </span>
                    </td>
                    <td className="p-3">
                      {op.caretakerApproval === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCaretakerDecision(op._id, "approved")}
                            disabled={processingId === op._id}
                            className={`px-3 py-1 rounded-lg shadow-md transition text-white ${
                              processingId === op._id
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {processingId === op._id ? "Approving..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleCaretakerDecision(op._id, "rejected")}
                            disabled={processingId === op._id}
                            className={`px-3 py-1 rounded-lg shadow-md transition text-white ${
                              processingId === op._id
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                          >
                            {processingId === op._id ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOutpassesPage;
