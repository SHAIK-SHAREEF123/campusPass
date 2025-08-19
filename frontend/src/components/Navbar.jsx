import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
// React Icons
import { FaUserCircle, FaCog, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef();

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/auth/logout",
                {},
                { withCredentials: true }
            );
            dispatch(logout());
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Role-based nav links
    const roleLinks = {
        admin: [
            { name: "Dashboard", to: "/admin/dashboard" },
            { name: "Hostels", to: "/hostels" },
        ],
        caretaker: [
            { name: "Dashboard", to: "/caretaker/dashboard" },
            { name: "Batches", to: "/batches" },
            { name: "Outpasses", to: "/outpasses" },
        ],
        student: [
            { name: "Dashboard", to: "/student/dashboard" },
            { name: "My Outpasses", to: "/outpass/my-outpasses" },
            { name: "Request Outpass", to: "/outpass/request" },
        ],
    };

    const navLinks = user?.role ? roleLinks[user.role] || [] : [
        { name: "Home", to: "/" },
        { name: "Features", to: "/features" },
        { name: "About", to: "/about" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-black bg-opacity-70 backdrop-blur-md border-b border-purple-800 shadow-md pt-1.5 pb-1.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <Link
                            to="/"
                            className="flex items-center focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <img
                                src="logo.jpeg"
                                alt="CampusPass Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <span className="ml-2 text-3xl font-extrabold text-purple-400 tracking-widest select-none">
                                CAMPUSPASS
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center text-lg font-medium text-white">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                to="/chat"
                                className="hover:text-purple-300 transition-colors duration-200"
                            >
                                Chat
                            </Link>
                        )}
                        {!user ? (
                            <Link
                                to="/login"
                                className="flex items-center hover:text-purple-300 transition-colors duration-200"
                            >
                                <FaSignInAlt className="mr-1" />
                                Login
                            </Link>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen((open) => !open)}
                                    className="focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full"
                                >
                                    {user.profilePhoto ? (
                                        <img
                                            src={user.profilePhoto}
                                            alt="User"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-400 cursor-pointer"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-10 h-10 text-purple-400" />
                                    )}
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg py-2 z-50">
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaUserCircle className="mr-2 text-purple-600" />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaCog className="mr-2 text-purple-600" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-purple-100"
                                        >
                                            <FaSignOutAlt className="mr-2 text-purple-600" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                            className="inline-flex items-center justify-center p-2 rounded-md text-purple-400 hover:text-white hover:bg-purple-700"
                        >
                            {mobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-black bg-opacity-80 backdrop-blur-md border-t border-purple-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                to="/chat"
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Chat
                            </Link>
                        )}
                        {!user ? (
                            <Link
                                to="/login"
                                className="flex items-center px-3 py-2 text-base font-medium text-white hover:bg-purple-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaSignInAlt className="mr-2" />
                                Login
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center px-3 py-2 text-base font-medium text-white hover:bg-purple-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FaUserCircle className="mr-2 text-purple-300" />
                                    My Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="flex items-center px-3 py-2 text-base font-medium text-white hover:bg-purple-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FaCog className="mr-2 text-purple-300" />
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-base font-medium text-white hover:bg-purple-700"
                                >
                                    <FaSignOutAlt className="mr-2 text-purple-300" />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
