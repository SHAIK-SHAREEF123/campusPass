// src/pages/AllOutpassesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOutpassesPage = () => {
    const [outpasses, setOutpasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch all outpasses
    const fetchOutpasses = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/outpasses", { withCredentials: true });
            setOutpasses(res.data); // backend sends array directly
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to load outpasses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutpasses();
    }, []);

    // Approve or Reject handler
    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(
                `/api/outpasses/${id}/status`,
                { status },
                { withCredentials: true }
            );
            fetchOutpasses();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Outpasses</h1>
            {outpasses.length === 0 ? (
                <p>No outpasses found</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Student Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Reason</th>
                            <th className="border p-2">Destination</th>
                            <th className="border p-2">From</th>
                            <th className="border p-2">To</th>
                            <th className="border p-2">Parent Approval</th>
                            <th className="border p-2">Caretaker Approval</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outpasses.map((op) => (
                            <tr key={op._id}>
                                <td className="border p-2">{op.student?.name}</td>
                                <td className="border p-2">{op.student?.email}</td>
                                <td className="border p-2">{op.reason}</td>
                                <td className="border p-2">{op.destination}</td>
                                <td className="border p-2">
                                    {new Date(op.fromDate).toLocaleDateString()}
                                </td>
                                <td className="border p-2">
                                    {new Date(op.toDate).toLocaleDateString()}
                                </td>
                                <td
                                    className={`border p-2 ${op.parentApproval === "approved"
                                            ? "text-green-600"
                                            : op.parentApproval === "rejected"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                        }`}
                                >
                                    {op.parentApproval}
                                </td>
                                <td
                                    className={`border p-2 ${op.caretakerApproval === "approved"
                                            ? "text-green-600"
                                            : op.caretakerApproval === "rejected"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                        }`}
                                >
                                    {op.caretakerApproval}
                                </td>
                                <td className="border p-2">
                                    {op.caretakerApproval === "pending" &&
                                        op.parentApproval === "approved" ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(op._id, "approved")}
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(op._id, "rejected")}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllOutpassesPage;
