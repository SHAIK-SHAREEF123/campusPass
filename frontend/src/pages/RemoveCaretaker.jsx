import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

export default function RemoveCaretakerPage() {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [caretakers, setCaretakers] = useState([]);
  const [loadingCaretakers, setLoadingCaretakers] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch hostels on page load
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await API.get("/hostels", {
          withCredentials: true,
        });
        setHostels(res.data.hostels || []);
      } catch (error) {
        toast.error("Failed to fetch hostels");
      }
    };
    fetchHostels();
  }, []);

  // ✅ Fetch caretakers when hostel is selected
  useEffect(() => {
    if (!selectedHostel) return;

    const fetchCaretakers = async () => {
      setLoadingCaretakers(true);
      try {
        const res = await API.get(
          `/hostels/${selectedHostel}/caretakers`,
          { withCredentials: true }
        );
        setCaretakers(res.data.caretakers || []);
      } catch (error) {
        toast.error("Failed to fetch caretakers");
      } finally {
        setLoadingCaretakers(false);
      }
    };

    fetchCaretakers();
  }, [selectedHostel]);

  // ✅ Remove caretaker
  const handleRemoveCaretaker = async (caretakerEmail) => {
    try {
      await API.post(
        "/hostels/remove-caretaker",
        {
          hostelName: selectedHostel,
          caretakerEmail,
        },
        { withCredentials: true }
      );

      toast.success("Caretaker removed successfully");
      navigate("/hostels");

      // Refresh caretakers after removal
      setCaretakers((prev) =>
        prev.filter((c) => c.email !== caretakerEmail)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove caretaker"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Remove Caretaker
            </h2>
            <p className="text-gray-300/80 text-sm leading-relaxed">
              Select a hostel to view and remove assigned caretakers
            </p>
          </div>

          {/* Form Container */}
          <div className="space-y-6">
            
            {/* Hostel Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200 mb-2 ml-1">
                Select Hostel
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedHostel}
                  onChange={(e) => setSelectedHostel(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/5 backdrop-blur border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-gray-900 text-gray-300">
                    Choose a hostel...
                  </option>
                  {hostels.map((hostel) => (
                    <option key={hostel._id} value={hostel.name} className="bg-gray-900 text-white">
                      {hostel.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Caretakers Section */}
            <div className="space-y-4">
              {selectedHostel && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Assigned Caretakers
                  </h3>
                  
                  {loadingCaretakers ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-300 text-sm">Loading caretakers...</span>
                      </div>
                    </div>
                  ) : caretakers.length > 0 ? (
                    <div className="space-y-3">
                      {caretakers.map((caretaker) => (
                        <div
                          key={caretaker._id}
                          className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">
                                  {caretaker.name}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {caretaker.email}
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveCaretaker(caretaker.email)}
                              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl border border-red-500/30 hover:border-red-400/50 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">
                        No caretakers assigned to this hostel
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Select a different hostel or assign caretakers first
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info Badge */}
            <div className="flex items-center justify-center pt-4">
              <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <svg className="w-4 h-4 text-amber-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5C3.312 16.333 4.274 18 5.814 18z" />
                </svg>
                <span className="text-amber-300 text-sm font-medium">
                  Admin privileges required
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}