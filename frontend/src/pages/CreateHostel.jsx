import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateHostel() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Hostel name is required");
      return;
    }

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-lg border border-white/50 hover:shadow-blue-500/10 transition-all duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg transform hover:rotate-3 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
            Create New Hostel
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Set up a new hostel to start managing students and facilities
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Field */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Hostel Name
            </label>
            
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a unique hostel name..."
                disabled={isSubmitting}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              {/* Input decoration */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                {name.trim() && (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Character counter */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Choose a name that's easy to remember and identify
              </p>
              <span className="text-xs text-gray-400 font-medium">
                {name.length}/100
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Hostel...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span>Create Hostel</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        {/* <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Secure & Encrypted</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>Instant Setup</span>
            </div>
          </div>
        </div> */}

        {/* Back Navigation */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/hostels")}
            disabled={isSubmitting}
            className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Hostels
          </button>
        </div>
      </div>

      {/* Floating elements for visual appeal */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-lg animate-bounce hidden lg:block" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-lg animate-pulse hidden xl:block" style={{animationDelay: '2s'}}></div>
    </div>
  );
}