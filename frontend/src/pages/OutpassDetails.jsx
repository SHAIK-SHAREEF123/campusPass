import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const OutpassDetails = () => {
  const { id } = useParams(); // use outpassId, not hostelId
  const { userInfo } = useSelector((state) => state.auth);
  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOutpass = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/outpass/${id}`,
          { withCredentials: true }
        );
        setOutpass(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load outpass");
      } finally {
        setLoading(false);
      }
    };
    fetchOutpass();
  }, [id]);

  const handleVerify = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/outpass/${id}/verify`,
        {},
        { withCredentials: true }
      );
      setOutpass(res.data.outpass);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update entry/exit");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-200">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!outpass) return <div className="min-h-screen flex items-center justify-center text-gray-200">No Outpass Found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl shadow-black/40 p-8">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-6">
          Outpass Details
        </h1>

        <div className="space-y-4">
          <Detail label="👤 Student" value={outpass.student?.name} />
          <Detail label="🏠 Hostel" value={outpass.hostel?.name} />
          <Detail label="🎯 Destination" value={outpass.destination} />
          <Detail label="📝 Reason" value={outpass.reason} />
          <Detail label="📅 From" value={new Date(outpass.fromDate).toLocaleDateString()} />
          <Detail label="📅 To" value={new Date(outpass.toDate).toLocaleDateString()} />
          <Detail label="📞 Parent Contact" value={outpass.parentContact} />
          <Detail
            label="📊 Status"
            value={
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                outpass.status === "approved"
                  ? "bg-green-500/20 text-green-400"
                  : outpass.status === "rejected"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {outpass.status}
              </span>
            }
          />
          {outpass.exitTime && <Detail label="🚪 Exit Time" value={new Date(outpass.exitTime).toLocaleString()} />}
          {outpass.entryTime && <Detail label="🔑 Entry Time" value={new Date(outpass.entryTime).toLocaleString()} />}
        </div>

        {outpass.qrCode && (
          <div className="mt-6 text-center">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">🎟️ QR Code</h2>
            <div className="bg-white p-4 rounded-lg inline-block shadow-lg">
              <img src={outpass.qrCode} alt="Outpass QR" className="w-48 h-48 object-contain" />
            </div>
          </div>
        )}

        {userInfo?.role === "security" && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleVerify}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md"
            >
              {outpass.exitTime && !outpass.entryTime
                ? "Mark Entry"
                : !outpass.exitTime
                ? "Mark Exit"
                : "Entry & Exit Recorded"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-semibold text-gray-300">{label}:</span>
    <span className="text-gray-100">{value || "N/A"}</span>
  </div>
);

export default OutpassDetails;
