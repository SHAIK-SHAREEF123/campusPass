import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  PlusCircle,
} from "lucide-react";

const StudentDashboardPage = () => {
  const [student, setStudent] = useState(null);
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/student", {
          withCredentials: true,
        });
        // console.log(res.data);
        setStudent(res.data.student);
        setOutpasses(res.data.outpasses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        Loading Dashboard...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  // ✅ Calculate stats
  const approvedCount = outpasses.filter((o) => o.status === "approved").length;
  const pendingCount = outpasses.filter((o) => o.status === "pending").length;
  const rejectedCount = outpasses.filter((o) => o.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 🌟 Header */}
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Student Dashboard
        </h1>

        {/* 👤 Profile Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 flex items-center gap-6">
          <img
            src={student.profilePhoto || "https://via.placeholder.com/80"}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" /> {student.name}
            </h2>
            <p className="text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4" /> {student.email}
            </p>
            <p className="text-gray-300 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> {student.hostel?.name || "N/A"}
            </p>
          </div>
        </div>

        {/* 📊 Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 flex flex-col items-center shadow-lg">
            <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
            <p className="text-lg font-semibold">{approvedCount} Approved</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 flex flex-col items-center shadow-lg">
            <Clock className="w-10 h-10 text-yellow-400 mb-2" />
            <p className="text-lg font-semibold">{pendingCount} Pending</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex flex-col items-center shadow-lg">
            <XCircle className="w-10 h-10 text-red-400 mb-2" />
            <p className="text-lg font-semibold">{rejectedCount} Rejected</p>
          </div>
        </div>

        {/* 🎟️ My Outpasses */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Outpasses</h2>
            <button
              onClick={() => navigate("/outpass/request")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-lg transition-all"
            >
              <PlusCircle className="w-5 h-5" /> New Outpass
            </button>
          </div>

          {outpasses.length === 0 ? (
            <p className="text-gray-400">No outpasses created yet.</p>
          ) : (
            <div className="space-y-4">
              {outpasses.map((outpass) => (
                <div
                  key={outpass._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center hover:bg-white/10 transition-all"
                >
                  <div>
                    <p className="font-semibold text-gray-200">
                      {outpass.destination} ({outpass.reason})
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(outpass.fromDate).toLocaleDateString()} →{" "}
                      {new Date(outpass.toDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      outpass.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : outpass.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {outpass.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
