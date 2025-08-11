import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields.");
            return;
        }

        // console.log(formData);
        try {
            setError("");
            setSuccess("");

            // console.log("Start: ");
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );
            console.log("End: ");
            // console.log(response.data);
            // Assuming response.data contains user info
            const userData = response.data;

            // Dispatch to redux store
            dispatch(setUser(userData));

            setSuccess("Login successful! Redirecting...");

            // Optional: delay before navigation to show success message
            setTimeout(() => {
                navigate("/");
                toast.success('Welcome back!');
            }, 1500);
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.message || "Login failed. Please try again.";
            setError(message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4 bg-gradient-to-r from-purple-700 via-purple-900 to-black">
            <form
                onSubmit={handleSubmit}
                className="bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-black text-center mb-6">
                    Login to CampusPass
                </h2>

                {error && (
                    <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>
                )}

                {success && (
                    <div className="mb-4 text-green-600 font-semibold text-center">{success}</div>
                )}

                <label className="block text-black font-medium mb-1" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full p-3 mt-1 mb-4 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />

                <label className="block text-black font-medium mb-1" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full p-3 mt-1 mb-6 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />

                <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                    Login
                </button>

                <p className="mt-6 text-center text-black font-medium">
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        className="text-purple-500 hover:text-purple-700 font-semibold"
                    >
                        Signup
                    </a>
                </p>
            </form>
        </div>
    );
}
