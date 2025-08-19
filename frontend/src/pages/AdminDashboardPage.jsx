// src/pages/AdminDashboardPage.jsx
import React,{ useEffect, useState } from "react";
import axios from "axios";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/dashboard/admin", {
          withCredentials: true,
        });
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching admin dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

//   console.log(stats);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>No data found</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <p>Total Students: {stats.totalStudents}</p>
        <p>Total Caretakers: {stats.totalCaretakers}</p>
        <p>Total Hostels: {stats.totalHostels}</p>
        <p>Total Outpasses: {stats.totalOutpasses}</p>
      </div>

      <h2>Recent Outpasses</h2>
      <ul>
        {stats.recentOutpasses && stats.recentOutpasses.length > 0 ? (
          stats.recentOutpasses.map((op) => (
            <li key={op._id}>
              {op.student?.name} - {op.reason} - {op.status}
            </li>
          ))
        ) : (
          <p>No recent outpasses</p>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboardPage;
