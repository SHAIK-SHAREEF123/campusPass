import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setOutpasses, setLoading, setError } from "../redux/outpassSlice";

const MyOutpasses = () => {
  const dispatch = useDispatch();
  const { outpasses, loading, error } = useSelector((state) => state.outpass);

    // console.log(outpasses);
  useEffect(() => {
    const fetchOutpasses = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get("http://localhost:5000/api/outpass/my-outpasses", {
          withCredentials: true,
        });
        // console.log(res);
        dispatch(setOutpasses(res.data.outpasses));
      } catch (err) {
        dispatch(setError(err.response?.data?.message || "Failed to fetch outpasses"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchOutpasses();
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Outpasses</h1>
      {(!outpasses || outpasses.length === 0)? (
        <p>No outpasses found.</p>
      ) : (
        <div className="grid gap-4">
          {outpasses.map((outpass) => (
            <div
              key={outpass._id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <p><strong>Reason:</strong> {outpass.reason}</p>
              <p><strong>Destination:</strong> {outpass.destination}</p>
              <p><strong>From:</strong> {new Date(outpass.fromDate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(outpass.toDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {outpass.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOutpasses;
