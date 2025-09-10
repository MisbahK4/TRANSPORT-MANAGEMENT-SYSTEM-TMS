import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaHome,
} from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5"; // 👁️ Eye icons
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "", // ✅ single role (owner or transporter)
    company_name: "",
    phone_no: "",
    address: "",
    state: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const [showPassword2, setShowPassword2] = useState(false); // 👁️ toggle

  // ✅ validation function
  const validateField = (name, value) => {
    let error = "";

    if (name === "username" && !value.trim()) {
      error = "Username is required.";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "Email is required.";
      else if (!emailRegex.test(value)) error = "Enter a valid email.";
    }

    if (name === "password") {
      const passRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!value) error = "Password is required.";
      else if (!passRegex.test(value))
        error = "Password must be at least 8 chars, include letter, number, and symbol.";
    }

    if (name === "password2") {
      if (value !== formData.password) error = "Passwords do not match.";
    }

    if (name === "phone_no") {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!value) error = "Phone number is required.";
      else if (!phoneRegex.test(value)) error = "Enter a valid phone number.";
    }

    if (["company_name", "address", "state", "country"].includes(name) && !value.trim()) {
      error = `${name.replace("_", " ")} is required.`;
    }

    if (name === "role" && !value) {
      error = "Please select a role.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // handle input change
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "role") {
      // ✅ Only one role at a time
      setFormData((prev) => ({ ...prev, role: value }));
      validateField("role", value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
      validateField(name, newValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // run all validations
    Object.keys(formData).forEach((field) => validateField(field, formData[field]));

    // check if any errors exist
    if (Object.values(errors).some((err) => err)) {
      setMessage("❌ Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        ...formData,
        is_owner: formData.role === "owner",
        is_transporter: formData.role === "transporter",
      });
      setMessage("✅ Registered successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        password2: "",
        role: "",
        company_name: "",
        phone_no: "",
        address: "",
        state: "",
        country: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      if (err.response?.data?.username) {
        setErrors((prev) => ({ ...prev, username: "❌ Username already exists." }));
      }
      setMessage("❌ Registration failed. Please check your input.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-5xl border border-gray-200"
      >
        {/* ✅ Home Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <FaHome className="text-lg" /> Home
        </button>

        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-2">
          Transport Management System
        </h2>
        <p className="text-center text-gray-600 mb-6 text-lg">
          Register your company and user account
        </p>

        {message && (
          <p className="text-center text-sm font-semibold text-red-600 mb-4">{message}</p>
        )}

        {/* User Info Section */}
        <Section title="User Information">
          <Input icon={<FaUser />} label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} />
          <Input icon={<FaEnvelope />} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
          <PasswordInput icon={<FaLock />} label="Password" name="password" value={formData.password} onChange={handleChange} error={errors.password} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
          <PasswordInput icon={<FaLock />} label="Confirm Password" name="password2" value={formData.password2} onChange={handleChange} error={errors.password2} show={showPassword2} toggle={() => setShowPassword2(!showPassword2)} />
          <Input icon={<FaPhone />} label="Phone Number" name="phone_no" value={formData.phone_no} onChange={handleChange} error={errors.phone_no} />
        </Section>

        {/* Company Info Section */}
        <Section title="Company Information">
          <Input icon={<FaBuilding />} label="Company Name" name="company_name" value={formData.company_name} onChange={handleChange} error={errors.company_name} />
          <Input icon={<FaMapMarkerAlt />} label="Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
          <Input icon={<FaMapMarkerAlt />} label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} />
          <Input icon={<FaGlobe />} label="Country" name="country" value={formData.country} onChange={handleChange} error={errors.country} />
        </Section>

        {/* ✅ Role Selection (Only one at a time) */}
        <div className="flex gap-10 justify-center mb-6">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <input
              type="radio"
              name="role"
              value="owner"
              checked={formData.role === "owner"}
              onChange={handleChange}
              className="accent-blue-600"
            />
            Owner
          </label>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <input
              type="radio"
              name="role"
              value="transporter"
              checked={formData.role === "transporter"}
              onChange={handleChange}
              className="accent-green-600"
            />
            Transporter
          </label>
        </div>
        {errors.role && <p className="text-red-500 text-sm text-center mb-4">{errors.role}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          Register Account
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already registered?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

// ✅ Input Component
const Input = ({ icon, label, name, type = "text", value, onChange, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <div
      className={`flex items-center border rounded-lg px-3 py-2 bg-white transition-all duration-300 ${
        error ? "border-red-500" : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-400"
      }`}
    >
      <span className="text-gray-500 mr-2">{icon}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-transparent outline-none text-gray-700"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// ✅ Password Input with Eye toggle
const PasswordInput = ({ icon, label, name, value, onChange, error, show, toggle }) => (
  <div className="mb-4 relative">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <div
      className={`flex items-center border rounded-lg px-3 py-2 bg-white transition-all duration-300 ${
        error ? "border-red-500" : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-400"
      }`}
    >
      <span className="text-gray-500 mr-2">{icon}</span>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-transparent outline-none text-gray-700"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      <button
        type="button"
        onClick={toggle}
        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {show ? <IoEyeOff /> : <IoEye />}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// ✅ Section wrapper
const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

export default RegisterForm;

