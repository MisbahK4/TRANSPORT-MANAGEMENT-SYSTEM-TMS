import React, { useState } from "react";
import API from "../../api";
import {
  Truck,
  BadgeIndianRupee,
  Boxes,
  CircleCheckBig,
  Settings2,
} from "lucide-react";

const Field = ({ icon: Icon, label, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <span className="bg-green-100 text-green-600 p-2 rounded-full">
        <Icon size={18} />
      </span>
      {label}
    </label>
    {children}
  </div>
);

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    truck_model: "",
    truck_number: "",
    capacity: "",
    wheels: 6,
    available: true,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("vehicles/", formData);
      setMessage("✅ Vehicle created successfully!");
      setFormData({
        truck_model: "",
        truck_number: "",
        capacity: "",
        wheels: 6,
        available: true,
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Error creating vehicle");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-xl shadow-xl p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-green-600 text-white p-3 rounded-full shadow-md">
          <Truck size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Add Vehicle</h2>
          <p className="text-sm text-gray-500">Register a new truck to your fleet</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field icon={Truck} label="Truck Model">
          <input
            type="text"
            name="truck_model"
            value={formData.truck_model}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </Field>

        <Field icon={Boxes} label="Truck Number">
          <input
            type="text"
            name="truck_number"
            value={formData.truck_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </Field>

        <Field icon={BadgeIndianRupee} label="Capacity (tons)">
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </Field>

        <Field icon={Settings2} label="Wheels">
          <input
            type="number"
            name="wheels"
            value={formData.wheels}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </Field>

        <Field icon={CircleCheckBig} label="Available">
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Yes</span>
          </div>
        </Field>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition duration-200"
          >
            <span className="bg-white text-green-600 p-2 rounded-full">
              <Truck size={18} />
            </span>
            Submit Vehicle
          </button>
        </div>
      </form>

      {/* Message */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-md text-sm ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default VehicleForm;
