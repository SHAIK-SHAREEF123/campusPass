import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Home, Building, Trash2 } from "lucide-react";
import API from "../utils/axiosInstance";

export default function HostelsPage() {
  const { user } = useSelector((state) => state.auth);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await API.get("/hostels", {
          withCredentials: true,
        });
        // console.log(res.data);
        setHostels(res.data.hostels || []);
      } catch (err) {
        console.error("Error fetching hostels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const handleDelete = async (hostelId, e) => {
    e.stopPropagation();
    // console.log("Delete clicked:", hostelId);

    if (!window.confirm("Are you sure you want to delete this hostel?")) return;
    try {
      setDeletingId(hostelId);
      await API.delete(`/hostels/${hostelId}`, {
        withCredentials: true,
      });
      setHostels((prev) => prev.filter((h) => h._id !== hostelId));
    } catch (err) {
      console.error("Delete error:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to delete hostel.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium text-lg animate-pulse">
            Loading hostels...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Hostels
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Manage and explore all available hostels
            </p>
          </div>
          {/* ✅ Show Create Hostel button only for admin */}
          {user?.role === "admin" && (
            <Link
              to="/create-hostel"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
              <span className="relative flex items-center gap-2">
                <Home className="w-5 h-5" />
                Create Hostel
              </span>
            </Link>
          )}
        </div>

        {/* Hostels List */}
        {hostels.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white/50 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-12 text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                  No Hostels Yet
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Start by creating your first hostel. They'll appear here for
                  easy management.
                </p>
              </div>
              {/* ✅ Show Create Hostel button only for admin */}
              {user?.role === "admin" && (
                <Link
                  to="/create-hostel"
                  className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
                  <span className="relative flex items-center gap-3">
                    <Building className="w-6 h-6" />
                    Create Your First Hostel
                  </span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostels.map((hostel) => (
              <div
                key={hostel._id}
                onClick={() => navigate(`/hostels/${hostel._id}`)}
                className="relative cursor-pointer bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-visible hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Top bar gradient */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

                {/* ✅ Delete button (admins only) */}
                {user?.role === "admin" && (
                  <div className="absolute top-3 right-3 z-50">
                    <div className="relative group">
                      <button
                        onClick={(e) => handleDelete(hostel._id, e)}
                        disabled={deletingId === hostel._id}
                        className="p-2 bg-red-600 rounded-full hover:bg-red-700 text-white shadow-md transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {/* Tooltip */}
                      <span className="absolute -top-8 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 bg-red-600 text-white text-xs font-semibold rounded px-2 py-1 transition-opacity duration-300 whitespace-nowrap">
                        Delete
                      </span>
                    </div>
                  </div>
                )}

                {/* Hostel info */}
                <div className="relative p-6 flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Building className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300 text-center">
                    {hostel.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
