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
} from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_BASE_URL_LOCAL
    : process.env.REACT_APP_API_BASE_URL_DEPLOY;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user"); // Tab state for mobile
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (name === "username" && !value.trim()) error = "Username is required.";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "Email is required.";
      else if (!emailRegex.test(value)) error = "Enter a valid email.";
    }
    if (name === "password") {
      const passRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!value) error = "Password is required.";
      else if (!passRegex.test(value))
        error = "Password must be 8+ chars, include letter, number & symbol.";
    }
    if (name === "password2")
      if (value !== formData.password) error = "Passwords do not match.";
    if (name === "phone_no") {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!value) error = "Phone number is required.";
      else if (!phoneRegex.test(value)) error = "Enter a valid phone number.";
    }
    if (
      ["company_name", "address", "state", "country"].includes(name) &&
      !value.trim()
    ) {
      error = `${name.replace("_", " ")} is required.`;
    }
    if (name === "role" && !value) error = "Please select a role.";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((err) => err)) {
      setMessage("❌ Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.post(`${API_BASE}register/`, {
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
      setMessage("❌ Registration failed. Please check your input.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 flex items-center justify-center p-4 sm:p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-6 sm:p-10 max-w-4xl w-full animate-fade-in border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center md:text-left">
          Register Account
        </h2>

        {/* Role Buttons */}
        <div className="flex justify-center md:justify-start gap-4 mb-6 flex-wrap">
          {["owner", "transporter"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role }))}
              className={`px-6 py-2 rounded-full font-medium transition shadow-md whitespace-nowrap ${
                formData.role === role
                  ? role === "owner"
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        {errors.role && (
          <p className="text-red-500 text-center md:text-left mb-6">{errors.role}</p>
        )}

        {/* Tab Navigation For Mobile */}
        <div className="block md:hidden mb-6 border-b border-gray-300">
          <nav className="flex justify-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("user")}
              className={`pb-2 font-semibold ${
                activeTab === "user"
                  ? "border-b-4 border-indigo-600 text-indigo-700"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              User Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={`pb-2 font-semibold ${
                activeTab === "company"
                  ? "border-b-4 border-indigo-600 text-indigo-700"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Company Info
            </button>
          </nav>
        </div>

        {/* Responsive Layout */}
        <div className="hidden md:grid grid-cols-2 gap-6">
          {/* Desktop: show all fields in two columns */}
          <div className="space-y-6">
            <Input
              icon={<FaUser />}
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            <Input
              icon={<FaEnvelope />}
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <PasswordInput
              icon={<FaLock />}
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
            <PasswordInput
              icon={<FaLock />}
              label="Confirm Password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              error={errors.password2}
              show={showPassword2}
              toggle={() => setShowPassword2(!showPassword2)}
            />
            <Input
              icon={<FaPhone />}
              label="Phone Number"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              error={errors.phone_no}
            />
          </div>
          <div className="space-y-6">
            <Input
              icon={<FaBuilding />}
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              error={errors.company_name}
            />
            <Input
              icon={<FaMapMarkerAlt />}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
            <Input
              icon={<FaMapMarkerAlt />}
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
            />
            <Input
              icon={<FaGlobe />}
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
            />
          </div>
        </div>

        {/* Mobile: show fields by active tab */}
        <div className="md:hidden space-y-6">
          {activeTab === "user" && (
            <>
              <Input
                icon={<FaUser />}
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
              />
              <Input
                icon={<FaEnvelope />}
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <PasswordInput
                icon={<FaLock />}
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
              <PasswordInput
                icon={<FaLock />}
                label="Confirm Password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                error={errors.password2}
                show={showPassword2}
                toggle={() => setShowPassword2(!showPassword2)}
              />
              <Input
                icon={<FaPhone />}
                label="Phone Number"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                error={errors.phone_no}
              />
            </>
          )}

          {activeTab === "company" && (
            <>
              <Input
                icon={<FaBuilding />}
                label="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                error={errors.company_name}
              />
              <Input
                icon={<FaMapMarkerAlt />}
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
              <Input
                icon={<FaMapMarkerAlt />}
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
              />
              <Input
                icon={<FaGlobe />}
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
              />
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={!formData.role}
          className={`mt-8 w-full py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 ${
            formData.role === "owner"
              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              : formData.role === "transporter"
              ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Register
        </button>

        <p className="text-center text-gray-600 mt-6">
          Already registered?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

const Input = ({ icon, label, name, type = "text", value, onChange, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <div
      className={`flex items-center border rounded-lg px-3 py-2 bg-white transition-all duration-300 ${
        error
          ? "border-red-500"
          : "border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400"
      }`}
    >
      <span className="text-gray-400 mr-2">{icon}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full outline-none bg-transparent text-gray-700"
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const PasswordInput = ({
  icon,
  label,
  name,
  value,
  onChange,
  error,
  show,
  toggle,
}) => (
  <div className="relative mb-4">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <div
      className={`flex items-center border rounded-lg px-3 py-2 bg-white transition-all duration-300 ${
        error
          ? "border-red-500"
          : "border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400"
      }`}
    >
      <span className="text-gray-400 mr-2">{icon}</span>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full outline-none bg-transparent text-gray-700"
      />
      <button
        type="button"
        onClick={toggle}
        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <IoEyeOff /> : <IoEye />}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default RegisterForm;
