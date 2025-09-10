import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdatePackage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    pickup_location: "",
    drop_location: "",
    weight: "",
    price_expectation: "",
    images: null,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch package details
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await API.get(`packages/${id}/`); // no leading slash
        setFormData({
          title: res.data.title || "",
          pickup_location: res.data.pickup_location || "",
          drop_location: res.data.drop_location || "",
          weight: res.data.weight || "",
          price_expectation: res.data.price_expectation || "",
          images: null, // keep null until user uploads new
        });
      } catch (err) {
        console.error("Error fetching package:", err);
      }
    };
    fetchPackage();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    try {
      await API.patch(`packages/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/owner-dashboard"); // redirect after update
    } catch (err) {
      console.error("Error updating package:", err.response?.data || err);
      alert("Failed to update package. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6"
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          ✏️ Update Package
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Package Title"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          {/* Pickup Location */}
          <textarea
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="Pickup Location"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          {/* Drop Location */}
          <textarea
            name="drop_location"
            value={formData.drop_location}
            onChange={handleChange}
            placeholder="Drop Location"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          {/* Weight */}
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          {/* Price */}
          <input
            type="number"
            name="price_expectation"
            value={formData.price_expectation}
            onChange={handleChange}
            placeholder="Expected Price"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          {/* Image Upload */}
          <input
            type="file"
            name="images"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)} // go back
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
            >
              ⬅ Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "💾 Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
