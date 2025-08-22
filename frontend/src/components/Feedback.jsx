import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Check login (you can replace with Redux/context check if needed)
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("You must be logged in to submit feedback");
      return;
    }

    // ✅ Validate fields
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    // ✅ Success
    toast.success("Thanks for your submission!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image / Illustration */}
        <div className="flex justify-center">
          <img
            src="feedback.svg"
            alt="Feedback Illustration"
            className="w-full max-w-md drop-shadow-lg"
          />
        </div>

        {/* Text + Feedback/Complaint Form */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Feedback & Complaints
          </h2>
          <p className="text-lg mb-6 text-gray-300">
            Your feedback helps us improve CampusPass. Whether it’s suggestions,
            issues, or complaints, we’re here to listen and act.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write your feedback or complaint..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold shadow-lg transition-all"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
