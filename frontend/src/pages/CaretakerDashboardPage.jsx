// frontend/src/pages/CaretakerDashboardPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Home,
    User,
    ClipboardList,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import API from "../utils/axiosInstance";

const CaretakerDashboardPage = () => {
    const [hostels, setHostels] = useState([]);
    const [outpasses, setOutpasses] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await API.get("/dashboard/caretaker", {
                    withCredentials: true,
                });
                setHostels(res.data.hostels);
                setOutpasses(res.data.outpasses);
                setStats(res.data.stats);
            } catch (err) {
                console.error("Error fetching caretaker dashboard:", err);
            } finally {
                setLoading(false);
            }
        };


        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
                Loading Caretaker Dashboard...
            </div>
        );
    }

    if (!hostels.length) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900 text-red-400">
                No hostels assigned yet
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-gray-100">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* 🌟 Header */}
                <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    Caretaker Dashboard
                </h1>

                {/* 🏠 Assigned Hostels */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Home className="w-6 h-6 text-blue-400" /> Assigned Hostels
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {hostels.map((hostel) => (
                            <div
                                key={hostel._id}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-md"
                            >
                                <h3 className="text-xl font-semibold text-indigo-300">
                                    {hostel.name}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Total Batches: {hostel.batches.length}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Total Students:{" "}
                                    {hostel.batches.reduce(
                                        (acc, batch) => acc + batch.students.length,
                                        0
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 📊 Quick Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 flex flex-col items-center shadow-lg">
                            <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
                            <p className="text-lg font-semibold">{stats.approvedCount} Approved</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 flex flex-col items-center shadow-lg">
                            <Clock className="w-10 h-10 text-yellow-400 mb-2" />
                            <p className="text-lg font-semibold">{stats.pendingCount} Pending</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex flex-col items-center shadow-lg">
                            <XCircle className="w-10 h-10 text-red-400 mb-2" />
                            <p className="text-lg font-semibold">{stats.rejectedCount} Rejected</p>
                        </div>
                    </div>
                )}

                {/* 🎟️ Outpasses */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-purple-400" /> Hostel Outpasses
                    </h2>
                    {outpasses.length === 0 ? (
                        <p className="text-gray-400">No outpasses available yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {outpasses.map((outpass) => (
                                <div
                                    key={outpass._id}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center hover:bg-white/10 transition-all"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-200">
                                            {outpass.student?.name} — {outpass.destination}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(outpass.fromDate).toLocaleDateString()} →{" "}
                                            {new Date(outpass.toDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${outpass.status === "approved"
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

export default CaretakerDashboardPage;
