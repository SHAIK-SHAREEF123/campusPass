import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, User, Shield } from "lucide-react";

export default function MyProfile() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto mt-12">
        No user data available. Please login.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      {/* Profile Picture */}
      <div className="flex flex-col items-center py-8 px-6">
        <img
          src={user.profilePhoto || "/default-profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
        />
        <h3 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h3>
        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* User Info (WhatsApp-like list) */}
      <div className="divide-y divide-gray-200 text-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <User className="text-green-600" size={22} />
            <span className="font-medium">Full Name</span>
          </div>
          <span className="text-gray-600">{user.name}</span>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" size={22} />
            <span className="font-medium">Email</span>
          </div>
          <span className="text-gray-600">{user.email}</span>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Shield className="text-purple-600" size={22} />
            <span className="font-medium">Role</span>
          </div>
          <span className="capitalize text-gray-600">{user.role}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t text-center">
        <button
          onClick={() => navigate("/")}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
