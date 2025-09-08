import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import API from "../utils/axiosInstance";

export default function ScanQR() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState(null);
  const [outpassDetails, setOutpassDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  // Security role check
  if (!user || user.role !== "security") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-xl font-semibold text-red-500">
          Unauthorized Access
        </h1>
      </div>
    );
  }

  // Function to handle scanned QR
  const handleScan = async (result) => {
    if (result) {
      setScannedData(result);
      setLoading(true);
      try {
        // Extract outpass ID from scanned URL
        const id = result.split("/").pop();
        const { data } = await API.get(
          `/outpass/${id}`
        );
        setOutpassDetails(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch outpass details.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Auto-start scanner on mount
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    codeReader
      .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          handleScan(result.getText());
          codeReader.reset(); // Stop scanning after first successful scan
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      })
      .catch((err) => console.error("Error starting scanner:", err));

    return () => {
      // Cleanup scanner on unmount
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Scan QR Code</h1>

      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
        <div className="mb-4">
          <video
            ref={videoRef}
            id="qr-video"
            className="w-full h-64 rounded-lg border border-gray-300"
          ></video>
        </div>

        {loading && (
          <p className="text-gray-500 mt-2">Fetching outpass details...</p>
        )}

        {outpassDetails && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-inner">
            <h2 className="font-bold text-lg mb-2">Outpass Details</h2>
            <p>
              <span className="font-semibold">Student:</span>{" "}
              {outpassDetails.student.name}
            </p>
            <p>
              <span className="font-semibold">Hostel:</span>{" "}
              {outpassDetails.hostel.name}
            </p>
            <p>
              <span className="font-semibold">Destination:</span>{" "}
              {outpassDetails.destination}
            </p>
            <p>
              <span className="font-semibold">Reason:</span>{" "}
              {outpassDetails.reason}
            </p>
            <p>
              <span className="font-semibold">From:</span>{" "}
              {new Date(outpassDetails.fromDate).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">To:</span>{" "}
              {new Date(outpassDetails.toDate).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Parent Contact:</span>{" "}
              {outpassDetails.parentContact}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {outpassDetails.status}
            </p>
          </div>
        )}

        {!outpassDetails && scannedData && !loading && (
          <p className="text-gray-500 mt-2">No outpass details found.</p>
        )}
      </div>
    </div>
  );
}
