// src/pages/HostelsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function HostelsPage() {
  const { user } = useSelector((state) => state.auth);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hostels", { withCredentials: true });
        setHostels(res.data.hostels || []);
      } catch (err) {
        console.error("Error fetching hostels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hostels</h1>
        {user?.role === "admin" && (
          <Link
            to="/create-hostel"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Create Hostel
          </Link>
        )}
      </div>

      {hostels.length === 0 ? (
        <div className="text-center bg-gray-100 p-8 rounded-lg shadow">
          <p className="text-lg font-medium mb-4">No hostels created yet.</p>
          {user?.role === "admin" && (
            <Link
              to="/create-hostel"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Create Hostel
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostels.map((hostel) => (
            <Link
              key={hostel._id}
              to={`/hostels/${hostel._id}`}
              className="block bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{hostel.name}</h2>
              <p className="text-gray-500 text-sm mt-1">
                Created on {new Date(hostel.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
