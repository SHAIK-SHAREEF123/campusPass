import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import API from "../utils/axiosInstance";

// Animation variants for Framer Motion-like effects
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [uiState, setUiState] = useState({
    error: "",
    success: "",
    showPassword: false,
    isLoading: false,
  });

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear messages on input change
    if (uiState.error || uiState.success) {
      setUiState(prev => ({ ...prev, error: "", success: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setUiState(prev => ({ ...prev, error: "Email is required" }));
      return false;
    }
    
    if (!formData.password.trim()) {
      setUiState(prev => ({ ...prev, error: "Password is required" }));
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setUiState(prev => ({ ...prev, error: "Please enter a valid email address" }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setUiState(prev => ({ ...prev, isLoading: true, error: "", success: "" }));

    try {
      const response = await API.post(
        "/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        },
        { withCredentials: true }
      );

      const userData = response.data;
      dispatch(setUser(userData));
      
      setUiState(prev => ({ ...prev, success: "Welcome back! Redirecting..." }));

      setTimeout(() => {
        navigate("/");
        toast.success("Login successful!");
      }, 1500);

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setUiState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Section */}
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            
            <p className="text-gray-600 text-base">
              Sign in to your CampusPass account
            </p>
          </div>

          {/* Login Form */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="relative group">
              {/* Glassmorphic Container */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-500 hover:shadow-3xl">
                
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl"></div>
                
                <div className="relative z-10 space-y-6">
                  
                  {/* Alert Messages */}
                  {uiState.error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm font-medium text-red-700">{uiState.error}</p>
                    </div>
                  )}

                  {uiState.success && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-sm font-medium text-green-700">{uiState.success}</p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="email" 
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Mail className="w-4 h-4 text-gray-500" />
                        Email Address
                      </label>
                      
                      <div className="relative group">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white hover:bg-gray-50"
                          disabled={uiState.isLoading}
                        />
                        
                        {/* Focus Glow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="password" 
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Lock className="w-4 h-4 text-gray-500" />
                        Password
                      </label>
                      
                      <div className="relative group">
                        <input
                          id="password"
                          name="password"
                          type={uiState.showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 pr-12 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white hover:bg-gray-50"
                          disabled={uiState.isLoading}
                        />
                        
                        {/* Password Toggle Button */}
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:text-gray-700"
                          disabled={uiState.isLoading}
                        >
                          {uiState.showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        
                        {/* Focus Glow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={uiState.isLoading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                    >
                      {uiState.isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                  </form>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <a
                      href="/forgot-password"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline focus:outline-none focus:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center animate-fade-in-up animation-delay-400">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline focus:outline-none focus:underline"
              >
                Create one here
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}