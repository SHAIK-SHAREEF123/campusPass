import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Toaster } from 'react-hot-toast';
import Settings from "./pages/Settings";
import MyProfile from "./pages/MyProfile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login /> } />
        <Route path="/settings" element={<Settings /> } />
        <Route path="/profile" element={<MyProfile />} />

      </Routes>

      <Toaster position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
