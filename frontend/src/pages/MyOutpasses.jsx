import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setOutpasses, setLoading, setError } from "../redux/outpassSlice";
import toast from "react-hot-toast";

const MyOutpasses = () => {
  const dispatch = useDispatch();
  const { outpasses, loading, error } = useSelector((state) => state.outpass);

  useEffect(() => {
    fetchOutpasses();
  }, []);

  const fetchOutpasses = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(
        "http://localhost:5000/api/outpass/my-outpasses",
        { withCredentials: true }
      );

      // Filter only required statuses
      const filtered = res.data.outpasses.filter(op =>
        ["pending", "approved", "rejected"].includes(op.status)
      );

      console.log(res.data);
      dispatch(setOutpasses(filtered));
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Failed to fetch outpasses")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };


  const cancelOutpass = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/outpass/cancel/${id}`,
        { withCredentials: true }
      );
      toast.success("Outpass cancelled successfully!");
      fetchOutpasses(); // refresh list
    } catch (err) {
      console.error("Cancel failed:", err);
      toast.error(err.response?.data?.message || "Failed to cancel outpass");
    }
  };


  const today = new Date();

  const getStatus = (outpass) => {
    const fromDate = new Date(outpass.fromDate);
    const today = new Date();

    // Reset time for accurate "day-only" comparison
    fromDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // If still pending and the fromDate is before today => expired
    if (outpass.status === "pending" && fromDate < today) {
      return "expired";
    }

    return outpass.status;
  };


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-purple-400 animate-pulse text-lg">
          Loading outpasses...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-6 text-white">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-lg tracking-wide">
        🚀 My Outpasses
      </h1>

      {(!outpasses || outpasses.length === 0) ? (
        <p className="text-center text-gray-400 text-lg">
          No outpasses found. ✨
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {outpasses.map((outpass, index) => {
            const status = getStatus(outpass);
            const fromDate = new Date(outpass.fromDate);

            return (
              <div
                key={outpass._id}
                className="relative group bg-gray-900/80 backdrop-blur-xl border border-purple-600/30 rounded-2xl shadow-xl shadow-purple-900/40 p-6 transition-all duration-500 hover:scale-[1.05] hover:shadow-purple-700/60"
              >
                {/* Outpass number badge */}
                <span className="absolute -top-3 -left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  #{index + 1}
                </span>

                {/* Destination */}
                <h2 className="text-2xl font-bold text-purple-300 mb-4 tracking-wide group-hover:text-pink-400 transition">
                  {outpass.destination}
                </h2>

                {/* Info */}
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="font-medium text-gray-200">Reason:</span>{" "}
                    {outpass.reason}
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">From:</span>{" "}
                    {new Date(outpass.fromDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">To:</span>{" "}
                    {new Date(outpass.toDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Hostel:</span>{" "}
                    {outpass.hostel?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Name:</span>{" "}
                    {outpass.student?.name} ({outpass.student?.email})
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Decision:</span>{" "}
                    {outpass.status === "approved" && (
                      <span className="text-green-400">
                        Approved by {outpass.processedBy?.name || "Caretaker"}
                      </span>
                    )}
                    {outpass.status === "rejected" && (
                      <span className="text-red-400">
                        Rejected by {outpass.processedBy?.name || "Caretaker"}
                      </span>
                    )}
                    {outpass.status === "pending" && (
                      <span className="text-yellow-400">Not yet processed</span>
                    )}
                  </p>

                </div>

                {/* Status */}
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-200 mr-2">
                      Status:
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-md ${status === "approved"
                        ? "bg-green-600/20 text-green-400 border border-green-500/40"
                        : status === "rejected"
                          ? "bg-red-600/20 text-red-400 border border-red-500/40"
                          : status === "expired"
                            ? "bg-gray-600/20 text-gray-400 border border-gray-500/40"
                            : "bg-yellow-600/20 text-yellow-400 border border-yellow-500/40"
                        }`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </div>

                  {/* Cancel Button only if still pending and not expired */}
                  {outpass.status === "pending" && (
                    <button
                      onClick={() => cancelOutpass(outpass._id)}
                      className="ml-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium shadow-lg transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOutpasses;
