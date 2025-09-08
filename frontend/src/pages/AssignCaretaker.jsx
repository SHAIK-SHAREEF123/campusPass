import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

export default function AssignCaretaker() {
    const [hostels, setHostels] = useState([]);
    const [caretakers, setCaretakers] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState("");
    const [selectedCaretaker, setSelectedCaretaker] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchHostels();
        fetchCaretakers();
    }, []);

    const fetchHostels = async () => {
        try {
            const res = await API.get("/hostels", {
                withCredentials: true,
            });
            setHostels(res.data.hostels);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch hostels");
        }
    };

    const fetchCaretakers = async () => {
        try {
            const res = await API.get("/hostels/caretakers", {
                withCredentials: true,
            });
            setCaretakers(res.data.caretakers);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch caretakers");
        }
    };

    const handleAssign = async () => {
        if (!selectedHostel || !selectedCaretaker) {
            toast.error("Please select both hostel and caretaker");
            return;
        }

        setIsLoading(true);
        try {
            await API.post(
                `/hostels/assign-caretaker`,
                { hostelName: selectedHostel, caretakerEmail: selectedCaretaker },
                { withCredentials: true }
            );
            toast.success("Caretaker assigned successfully");
            setSelectedHostel("");
            setSelectedCaretaker("");
            navigate("/hostels");
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Failed to assign caretaker");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                    
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            Assign Caretaker
                        </h2>
                        <p className="text-gray-300/80 text-sm leading-relaxed">
                            Connect hostels with dedicated caretakers to ensure optimal management
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
                                    className="w-full px-4 py-3.5 bg-white/5 backdrop-blur border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                                    value={selectedHostel}
                                    onChange={(e) => setSelectedHostel(e.target.value)}
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

                        {/* Caretaker Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200 mb-2 ml-1">
                                Select Caretaker
                                <span className="text-red-400 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3.5 bg-white/5 backdrop-blur border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                                    value={selectedCaretaker}
                                    onChange={(e) => setSelectedCaretaker(e.target.value)}
                                >
                                    <option value="" className="bg-gray-900 text-gray-300">
                                        Choose a caretaker...
                                    </option>
                                    {caretakers.map((ct) => (
                                        <option key={ct._id} value={ct.email} className="bg-gray-900 text-white">
                                            {ct.name} ({ct.email})
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

                        {/* Assignment Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleAssign}
                                disabled={isLoading || !selectedHostel || !selectedCaretaker}
                                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl border border-blue-500/30 hover:border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:border-gray-500/30"
                            >
                                <span className="flex items-center justify-center">
                                    {isLoading ? (
                                        <>
                                            <svg className="w-5 h-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Assign Caretaker
                                        </>
                                    )}
                                </span>
                            </button>
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