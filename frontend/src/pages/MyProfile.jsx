import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-4 text-center">
        No user data available. Please login.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">My Profile</h2>

      <div className="flex flex-col space-y-3">
        <img
          src={user.profilePhoto || "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-2 border-purple-400"
        />

        <div>
          <span className="font-semibold">Full Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user.role}
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}