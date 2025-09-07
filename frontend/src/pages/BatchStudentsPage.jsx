import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function BatchStudentsPage() {
  const { hostelId, batchId } = useParams();
  const [batchName, setBatchName] = useState("");
  const [hostelName, setHostelName] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  const isCaretakerOrAdmin = user?.role === "caretaker" || user?.role === "admin";

  // Fetch students in batch
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/hostels/${hostelId}/batch/${batchId}/students`,
        { withCredentials: true }
      );
      // console.log(res.data);
      setHostelName(res.data.hostelName);
      setBatchName(res.data.batchName || "");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [hostelId, batchId]);

  // Add student by email
  const handleAddStudent = async () => {
    if (!newStudentEmail.trim()) return alert("Enter student email");

    setIsAddingStudent(true);
    try {
      await axios.post(
        `http://localhost:5000/api/hostels/${hostelId}/batch/${batchId}/add-student`,
        { email: newStudentEmail },
        { withCredentials: true }
      );
      setNewStudentEmail("");
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add student");
      console.error(err);
    } finally {
      setIsAddingStudent(false);
    }
  };

  // console.log(students);

  // Remove student
  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Remove this student?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/hostels/${hostelId}/batch/${batchId}/remove-student/${studentId}`,
        { withCredentials: true }
      );
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove student");
      console.error(err);
    }
  };

  // Enhanced Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-blue-400 rounded-full animate-ping mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Students</h2>
          <p className="text-gray-600">Please wait while we fetch the student data...</p>
        </div>
      </div>
    );
  }

  // Enhanced Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full border border-red-100">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something Went Wrong</h2>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg transform hover:rotate-3 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                {/* <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{students.length}</span>
                </div> */}
              </div>

              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {hostelName}
                </h1>
                <p className="text-gray-600 text-lg mt-1">Manage students in this batch efficiently</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  {/* <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div> */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Batch Name</p>
                    <p className="text-lg font-bold text-gray-900">{batchName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Student Section */}
        {isCaretakerOrAdmin && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/50 hover:shadow-blue-500/10 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Student</h2>
                <p className="text-gray-600">Invite a student to join this batch by entering their email address</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter student email address..."
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-500 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddStudent()}
                />
              </div>

              <button
                onClick={handleAddStudent}
                disabled={isAddingStudent}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center gap-3 min-w-[160px] text-lg"
              >
                {isAddingStudent ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    <span>Add Student</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Students List */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">

          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50/90 to-blue-50/90 border-b border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">Students Directory</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
                  {students.length} {students.length === 1 ? 'Student' : 'Students'}
                </div>
                {isCaretakerOrAdmin && (
                  <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold text-sm">
                    Admin Access
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          {students.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-600 mb-4">No students in this batch yet</h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed text-lg mb-8">
                {isCaretakerOrAdmin
                  ? "Ready to build your batch? Start by adding students using the form above. Each student will receive access to join this batch."
                  : "This batch is waiting for students to be added. Check back soon to see who joins!"
                }
              </p>
              {isCaretakerOrAdmin && (
                <button
                  onClick={() => document.querySelector('input[type="email"]')?.focus()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                >
                  Add Your First Student
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100/50">
              {students.map((student, index) => (
                <div
                  key={student._id}
                  className="p-6 sm:p-8 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-blue-50/50 transition-all duration-300 group"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: "slideInUp 0.6s ease-out forwards",
                    opacity: 0,
                    transform: "translateY(20px)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-6">
                      {/* ✅ Profile Photo */}
                      <div className="relative">
                        <img
                          src={student.profilePhoto || "No photo"} // fallback image
                          alt={student.name || "Student"}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg shadow-blue-500/30 transform group-hover:scale-110 transition-all duration-300"
                        />
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300 truncate">
                          {student.name || "Unknown Student"}
                        </h3>

                        {/* Email */}
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <svg
                            className="w-5 h-5 text-gray-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                          <span className="font-medium truncate">{student.email}</span>
                        </div>

                        {/* Extra Info */}
                        {/* <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            Role: {student.role}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            ID: #{student._id?.slice(-6)?.toUpperCase()}
                          </span>
                        </div> */}
                      </div>
                    </div>

                    {/* Remove Button */}
                    {isCaretakerOrAdmin && (
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleRemoveStudent(student._id)}
                          className="bg-red-50 hover:bg-red-500 border-2 border-red-200 hover:border-red-500 text-red-600 hover:text-white p-3 sm:p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transform hover:scale-110 group-hover:opacity-100 sm:opacity-0"
                          title="Remove student from batch"
                        >
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}