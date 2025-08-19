import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { addOutpass } from "../redux/outpassSlice.js"; // Import action

const RequestOutpass = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth); // token is inside user
    // const {outpasses} = useSelector((state) => state.outpass);
    const token = user?.token;
    // console.log(token);

    const [reason, setReason] = useState("");
    const [destination, setDestination] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [parentContact, setParentContact] = useState("");

    // console.log(outpasses);

    // Restrict access to students only
    // console.log(user);
    if (user?.role !== "student") {
        return <div className="text-center text-red-600 mt-10">Access Denied</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason || !destination || !fromDate || !toDate) {
            toast.error("Please fill all required fields");
            return;
        }

        const requestData = {
            reason,
            destination,
            fromDate,
            toDate,
            parentContact,
        };

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/outpass/create", // match your backend route
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials : true,
                }
            );

            // Update Redux state
            dispatch(addOutpass(data));

            toast.success("Outpass request submitted");
            navigate("/outpass/my-outpasses");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create outpass");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Create Outpass</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Reason */}
                    <div>
                        <label className="block font-medium">Reason</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Enter reason for outpass"
                            required
                        ></textarea>
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="block font-medium">Destination</label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter destination"
                            required
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">From Date</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium">To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium">Parent Contact</label>
                        <input
                            type="text"
                            value={parentContact}
                            onChange={(e) => setParentContact(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter parent's phone/email"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestOutpass;
