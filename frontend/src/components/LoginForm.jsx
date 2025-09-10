import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE = "http://127.0.0.1:8000"; // adjust if needed

const LoginForm = ({ setToken, setIsOwner, setIsTransporter }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({}); // { username, password, general }
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clear only the field's error on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  // Basic client-side validation
  const validateForm = () => {
    const newErr = {};
    if (!formData.username.trim()) newErr.username = "Username is required.";
    if (!formData.password.trim()) newErr.password = "Password is required.";
    return newErr;
  };

  // Optional helper: call backend to check if username exists.
  // If you don't have this endpoint, the function returns null.
  const checkUsernameExists = async (username) => {
    if (!username) return null;
    try {
      const resp = await axios.get(`${API_BASE}/api/users/exists/`, {
        params: { username },
      });
      // Expect { exists: true/false }
      return resp?.data?.exists === true;
    } catch (err) {
      // Endpoint not available / network error -> return null
      return null;
    }
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
      const resp = await axios.post(`${API_BASE}/api/login/`, formData);
      const { access, refresh, is_owner, is_transporter } = resp.data;

      localStorage.setItem("token", access);
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

      if (respData) {
        // 1) Prefer explicit field errors if backend provided them
        if (respData.username) {
          newErrors.username = Array.isArray(respData.username)
            ? respData.username[0]
            : String(respData.username);
        }
        if (respData.password) {
          newErrors.password = Array.isArray(respData.password)
            ? respData.password[0]
            : String(respData.password);
        }

        // 2) If there's a generic detail (e.g. "No active account found..."),
        //    try to guess which field is wrong by calling username-exists helper.
        if (!newErrors.username && !newErrors.password && respData.detail) {
          // Try username existence check — optional endpoint
          const username = formData.username?.trim();
          if (username) {
            const exists = await checkUsernameExists(username);
            if (exists === true) {
              newErrors.password = "Incorrect password.";
            } else if (exists === false) {
              newErrors.username = "Username not found.";
            } else {
              // unknown -> fall back to general detail message
              newErrors.general = String(respData.detail);
            }
          } else {
            newErrors.general = String(respData.detail);
          }
        }

        // 3) If backend returned something else (unexpected shape), use fallback
        if (!newErrors.username && !newErrors.password && !newErrors.general) {
          // try common places
          newErrors.general =
            typeof respData === "string"
              ? respData
              : respData.detail || "Login failed. Please check credentials.";
        }
      } else {
        // network / no response
        newErrors.general = "Network error — please try again.";
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

          {/* General / non-field error */}
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
                errors.username ? "border-red-500 focus:ring-red-400" : "focus:ring-indigo-400 border-gray-300"
              }`}
              placeholder="Enter username"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
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
                  errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-indigo-400 border-gray-300"
                }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
