import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function BatchStudentsPage() {
  const { hostelId, batchId } = useParams();
  const { user } = useSelector((state) => state.auth); // get logged-in user
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudentEmail, setNewStudentEmail] = useState("");

  const isCaretakerOrAdmin = user?.role === "caretaker" || user?.role === "admin";

  // Fetch students in batch
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/hostels/${hostelId}/batch/${batchId}/students`,
        { withCredentials: true }
      );
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [hostelId, batchId]);

  // Add student by email
  const handleAddStudent = async () => {
    if (!newStudentEmail.trim()) return alert("Enter student email");

    try {
      await axios.post(
        `http://localhost:5000/api/hostels/${hostelId}/batch/${batchId}/add-student`,
        { email: newStudentEmail },
        { withCredentials: true }
      );
      setNewStudentEmail("");
      fetchStudents(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add student");
      console.error(err);
    }
  };

  // Remove student
  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Remove this student?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/hostels/${hostelId}/batch/${batchId}/remove-student/${studentId}`,
        { withCredentials: true }
      );
      fetchStudents(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove student");
      console.error(err);
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Batch Students</h1>

      {/* Add student section (only for caretaker/admin) */}
      {isCaretakerOrAdmin && (
        <div className="mb-6 flex gap-2">
          <input
            type="email"
            placeholder="Student email"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleAddStudent}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Student
          </button>
        </div>
      )}

      {/* Students list */}
      {students.length === 0 ? (
        <p className="text-gray-600">No students in this batch yet.</p>
      ) : (
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <span>{student.name} ({student.email})</span>

              {/* Remove button only for caretaker/admin */}
              {isCaretakerOrAdmin && (
                <button
                  onClick={() => handleRemoveStudent(student._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}