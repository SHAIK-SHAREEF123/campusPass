import React, { useEffect, useState } from "react";
import axios from "axios";

const CaretakerDashboardPage = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/dashboard/caretaker", {
          withCredentials: true,
        });

        // console.log("Caretaker Dashboard data:", data);

        if (data.hostels) {
          setHostels(data.hostels);
        } else {
          console.error("No hostels assigned to this caretaker");
        }
      } catch (error) {
        console.error("Error fetching caretaker dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!hostels.length) return <p>No hostels assigned</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Caretaker Dashboard</h1>

      {hostels.map((hostel) => (
        <div key={hostel._id} className="mb-6 p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold mb-2">{hostel.name}</h2>
          <p><strong>Caretakers:</strong> {hostel.caretakers.map(c => c.name).join(", ")}</p>
          <p>
            <strong>Total Students:</strong>{" "}
            {hostel.batches?.reduce((sum, batch) => sum + (batch.students?.length || 0), 0)}
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Students</h3>
          {hostel.batches?.map((batch, i) => (
            <div key={i} className="mb-2">
              <p className="font-medium">{batch.name}</p>
              <ul className="ml-4 list-disc">
                {batch.students?.map((student) => (
                  <li key={student._id}>
                    {student.name} ({student.email})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CaretakerDashboardPage;
