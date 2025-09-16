import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE = process.env.NODE_ENV === "development"
  ? process.env.REACT_APP_API_BASE_URL_LOCAL
  : process.env.REACT_APP_API_BASE_URL_DEPLOY;

const LoginForm = ({ setToken, setIsOwner, setIsTransporter }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const newErr = {};
    if (!formData.username.trim()) newErr.username = "Username is required.";
    if (!formData.password.trim()) newErr.password = "Password is required.";
    return newErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const resp = await axios.post(`${API_BASE}login/`, formData);
 
      // Django SimpleJWT default endpoint: /api/token/

      const { access, refresh, is_owner, is_transporter } = resp.data;

      // ✅ Store correctly for api.js
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      setToken(access);
      setIsOwner(Boolean(is_owner));
      setIsTransporter(Boolean(is_transporter));

      if (is_owner) navigate("/owner-dashboard");
      else if (is_transporter) navigate("/transporter-dashboard");
      else navigate("/");
    } catch (err) {
      const respData = err?.response?.data;
      const newErrors = {};
      if (respData?.detail) {
        newErrors.general = respData.detail;
      } else {
        newErrors.general = "Login failed. Please check credentials.";
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-100 to-slate-300">
      {/* Left: Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6 border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center">TMS Login</h2>
          <p className="text-center text-gray-500">Access your transport dashboard</p>

          {errors.general && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm text-center">
              {errors.general}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                errors.username
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-indigo-400 border-gray-300"
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-indigo-400 border-gray-300"
                }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
          >
            <FaHome className="text-indigo-600" /> Go to Home
          </button>
        </form>
      </div>

      {/* Right: Register CTA */}
      <div className="flex-1 bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center px-6 py-12">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold">New to TMS?</h2>
          <p className="text-lg">Register now to streamline your transport operations.</p>
          <a
            href="/register"
            className="inline-block bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
