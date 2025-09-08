import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Home, Star, LogIn, UserPlus } from "lucide-react";
import { logout } from "../redux/authSlice";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../utils/axiosInstance";
// React Icons
import { FaUserCircle, FaCog, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
// Animation
import { motion } from "framer-motion";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      await API.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );
      dispatch(logout());
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed!");
    }
  };

    // Role-based nav links
  const roleLinks = {
    admin: [
      { name: "Home", to: "/" },
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Hostels", to: "/hostels" },
      { name: "Create Hostel", to: "/create-hostel" },
    ],
    caretaker: [
      { name: "Home", to: "/" },
      { name: "Dashboard", to: "/caretaker/dashboard" },
      { name: "Hostels", to: "/hostels" },
      { name: "Outpasses", to: "/outpasses" },
    ],
    student: [
      { name: "Home", to: "/" },
      { name: "Dashboard", to: "/student/dashboard" },
      { name: "My Outpasses", to: "/outpass/my-outpasses" },
      { name: "Request Outpass", to: "/outpass/request" },
      { name: "Hostels", to: "/hostels" },
    ],
    security: [
      { name: "Home", to: "/" },
      { name: "Dashboard", to: "/security/dashboard" },
      { name: "Scan QR", to: "/security/scan" },
      { name: "Logs", to: "/security/logs" },
    ],
  };


  const navLinks = user?.role
    ? roleLinks[user.role] || []
    : [
        { name: "Home", to: "/", icon: <Home className="w-4 h-4" /> },
        { name: "Features", scroll: "features", icon: <Star className="w-4 h-4" /> },
      ];

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-purple-800 shadow-lg shadow-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src="/logo.jpeg"
                alt="CampusPass Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="ml-2 text-3xl font-extrabold text-purple-400 tracking-widest select-none">
                CAMPUSPASS
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center text-lg font-medium text-white">
            {navLinks.map((link) =>
              link.scroll ? (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  key={link.name}
                  className="flex items-center gap-2"
                >
                  <ScrollLink
                    to={link.scroll}
                    smooth={true}
                    duration={600}
                    offset={-80}
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md bg-transparent hover:bg-purple-700/20 hover:text-purple-300 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </ScrollLink>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  key={link.name}
                  className="flex items-center gap-2"
                >
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-transparent hover:bg-purple-700/20 hover:text-purple-300 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </motion.div>
              )
            )}

            {/* {user && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/chat"
                  className="px-3 py-2 rounded-md bg-transparent hover:bg-purple-700/20 hover:text-purple-300 transition-all duration-300"
                >
                  Chat
                </Link>
              </motion.div>
            )} */}

            {!user ? (
              <div className="flex items-center space-x-4">
                {/* Signup (Signup) CTA */}
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Signup
                </Link>
                {/* Login link */}
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-transparent hover:bg-purple-700/20 hover:text-purple-300 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </div>
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
              {mobileMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-purple-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) =>
              link.scroll ? (
                <ScrollLink
                  key={link.name}
                  to={link.scroll}
                  smooth={true}
                  duration={600}
                  offset={-80}
                  className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </ScrollLink>
              ) : (
                <Link
                  key={link.name}
                  to={link.to}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              )
            )}

            {/* {user && (
              <Link
                to="/chat"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Chat
              </Link>
            )} */}

            {!user ? (
              <>
                {/* Signup (Signup) CTA */}
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className="w-4 h-4" />
                  Signup
                </Link>
                {/* Login */}
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-white hover:bg-purple-700 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-base font-medium text-white hover:bg-purple-700 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaUserCircle className="mr-2 text-purple-300" />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 text-base font-medium text-white hover:bg-purple-700 transition-all duration-300"
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
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-white hover:bg-purple-700 transition-all duration-300"
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
