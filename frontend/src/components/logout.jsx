import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ setToken, setIsOwner, setIsTransporter }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear tokens from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");

    // ✅ Reset auth state in React
    if (setToken) setToken(null);
    if (setIsOwner) setIsOwner(false);
    if (setIsTransporter) setIsTransporter(false);

 
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-md"
    >
      Logout
    </button>
  );
}
