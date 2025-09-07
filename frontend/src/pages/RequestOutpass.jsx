import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const RequestOutpass = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [hostel, setHostel] = useState(""); // selected hostel (id)
  const [hostels, setHostels] = useState([]); // list of hostels

  // ✅ Fetch hostels on mount
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hostels", {
          withCredentials: true,
        });
        setHostels(response.data.hostels || []);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };

    fetchHostels();
  }, []);

  // ❌ Block non-students
  if (user?.role !== "student") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚫</span>
            </div>
            <div>
              <h3 className="text-red-400 font-semibold text-lg">Access Denied</h3>
              <p className="text-gray-400 text-sm">Student access required</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason || !destination || !fromDate || !toDate || !hostel) {
      alert("Please fill all required fields");
      return;
    }

    const requestData = {
      reason,
      destination,
      fromDate,
      toDate,
      parentContact,
      hostel, // send hostel ObjectId to backend
    };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/outpass/create",
        requestData,
        { withCredentials: true }
      );
      
      // Reset form
      setReason("");
      setDestination("");
      setFromDate("");
      setToDate("");
      setParentContact("");
      setHostel("");

      toast.success("Outpass request submitted successfully! 🎉");
      navigate("/outpass/my-outpasses");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to create outpass request!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4 sm:p-6 lg:p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3">
            Request Outpass
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            Submit your outpass request with all required details
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20 p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
            {/* Hostel Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center">
                <span className="mr-2">🏠</span>
                Select Hostel
                <span className="text-red-400 ml-1">*</span>
              </label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full p-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                required
              >
                <option value="">-- Select Hostel --</option>
                {Array.isArray(hostels) &&
                  hostels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center">
                <span className="mr-2">💭</span>
                Reason for Outpass
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 resize-none hover:bg-white/10"
                rows="4"
                placeholder="Describe the purpose..."
                required
              />
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center">
                <span className="mr-2">📍</span>
                Destination
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                placeholder="Where are you planning to go?"
                required
              />
            </div>

            {/* Date Range */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center">
                  <span className="mr-2">📅</span>
                  From Date
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-gray-100 [color-scheme:dark]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center">
                  <span className="mr-2">📅</span>
                  To Date
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-gray-100 [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            {/* Parent Contact */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center">
                <span className="mr-2">📞</span>
                Parent/Guardian Contact
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                value={parentContact}
                onChange={(e) => setParentContact(e.target.value)}
                className="w-full p-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                placeholder="10-digit number"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25 active:translate-y-0 active:shadow-lg"
              >
                Submit Outpass Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestOutpass;
