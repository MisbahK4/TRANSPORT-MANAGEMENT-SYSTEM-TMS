import React, { useState, useEffect } from "react";
import API from "../../api";
import { User, Phone, IdCard, Briefcase, Users, Truck } from "lucide-react";

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

const StaffForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    license_number: "",
    role: "driver",
    vehicle_number: "", // ✅ send truck_number instead of ID
  });

  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Assumes your backend returns only the logged-in transporter's vehicles
        // and that each vehicle object includes { id, truck_number, wheels, ... }.
        const res = await API.get("vehicles/");
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setMessage("❌ Could not load vehicles.");
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("staff/", formData);
      setMessage("✅ Staff member added successfully!");
      setFormData({
        name: "",
        contact: "",
        license_number: "",
        role: "driver",
        vehicle_number: "",
      });
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      const details =
        typeof error.response?.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response?.data || error.message;
      setMessage("❌ Error adding staff: " + details);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-xl shadow-xl p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-green-600 text-white p-3 rounded-full shadow-md">
          <Users size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Add Staff</h2>
          <p className="text-sm text-gray-500">
            Register a new staff member to your team
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field icon={User} label="Full Name">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </Field>

        <Field icon={Phone} label="Contact">
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </Field>

        <Field icon={Briefcase} label="Role">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="driver">Driver</option>
            <option value="helper">Helper</option>
          </select>
        </Field>

        <Field icon={IdCard} label="License Number">
          <input
            type="text"
            name="license_number"
            value={formData.license_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </Field>

        <Field icon={Truck} label="Assign Vehicle (by number)">
          <select
            name="vehicle_number"   // ✅ key change
            value={formData.vehicle_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">-- Select Vehicle --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.truck_number}>
                {v.truck_number} ({v.wheels} wheels)
              </option>
            ))}
          </select>
        </Field>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition duration-200"
          >
            <span className="bg-white text-green-600 p-2 rounded-full">
              <Users size={18} />
            </span>
            Submit Staff
          </button>
        </div>
      </form>

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

export default StaffForm;
