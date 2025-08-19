import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Toaster } from 'react-hot-toast';
import Settings from "./pages/Settings";
import MyProfile from "./pages/MyProfile";
import HostelsPage from "./pages/HostelsPage";
import CreateHostel from "./pages/CreateHostel";
import HostelBatches from "./pages/HostelBatches";
import CreateBatch from "./pages/CreateBatch";
import BatchStudentsPage from "./pages/BatchStudentsPage";
import RequestOutpass from "./pages/RequestOutpass";
import MyOutpasses from "./pages/MyOutpasses";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CaretakerDashboardPage from "./pages/CaretakerDashboardPage"
// import AllOutpassesPage from "./pages/AllOutpasses";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login /> } />
        <Route path="/settings" element={<Settings /> } />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/hostels" element={<HostelsPage />} />
        <Route path="/create-hostel" element={ <CreateHostel /> } />
        <Route path="/hostels/:hostelId" element={ <HostelBatches />} />
        <Route path="/hostels/:hostelId/create-batch" element={ <CreateBatch />} />
        <Route path="/hostels/:hostelId/batch/:batchId/students" element={ <BatchStudentsPage />} />
        <Route path="/outpass/request" element={ < RequestOutpass/>} />
        <Route path="/outpass/my-outpasses" element={ < MyOutpasses />} />
        {/* <Route path="/outpasses" element={ <AllOutpassesPage />} /> */}
        <Route path="/admin/dashboard" element={ <AdminDashboardPage />} />
        <Route path="/caretaker/dashboard" element={ <CaretakerDashboardPage />} />

      </Routes>

      <Toaster position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
