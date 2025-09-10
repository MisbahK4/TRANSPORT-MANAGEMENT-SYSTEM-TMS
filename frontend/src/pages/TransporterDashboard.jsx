// src/pages/TransporterDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaUsers,
  FaHome,
  FaHandshake,
  FaBox,
  FaShippingFast,
  FaRoute,
  FaBars,
  FaSearch,
  FaBell,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";

import LogoutButton from "../components/logout";

// transporter sections
import Vehicles from "../components/TransporterDashComponent/Vehicles";
import Staff from "../components/TransporterDashComponent/Staff";
import Negotiations from "../components/TransporterDashComponent/Negotiations";
import CurrentDeliveries from "../components/TransporterDashComponent/CurrentDeliveries";
import LoadedPackages from "../components/TransporterDashComponent/LoadedPackages";
// import OnWayPackages from "../components/TransporterDashComponent/OnWayPackages";
import ManageVehicleStaff from "../components/TransporterDashComponent/ManageStaffVehicals";
import Profile from "../components/Profile";

// floating chat + overlay
import FloatingChatButton from "../components/FloatingChatButton";
import ChatOverlay from "../components/ChatOverlay";

const menuItems = [
  { label: "Home", icon: <FaHome />, redirect: true },
  { label: "Profile", icon: <FaUserCircle /> },
  { label: "Vehicles", icon: <FaTruck /> },
  { label: "Staff", icon: <FaUsers /> },
  { label: "Manage Staff Vehicals", icon: <FaStar /> },
  { label: "Negotiations", icon: <FaHandshake /> },
  { label: "CurrentDeliveries", icon: <FaBox /> },
  { label: "LoadedPackages", icon: <FaShippingFast /> },
  // { label: "OnWayPackages", icon: <FaRoute /> },
];

export default function TransporterDashboard() {
  const [activeSection, setActiveSection] = useState("Vehicles");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeSection) {
      case "Profile": return <Profile />;
      case "Vehicles": return <Vehicles />;
      case "Staff": return <Staff />;
      case "Manage Staff Vehicals": return <ManageVehicleStaff />;
      case "Negotiations": return <Negotiations />;
      case "CurrentDeliveries": return <CurrentDeliveries />;
      case "LoadedPackages": return <LoadedPackages />;
      // case "OnWayPackages": return <OnWayPackages />;
      default: return <Vehicles />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 font-sans transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-72" : "w-20"} bg-white shadow-xl border-r border-slate-200 flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-green-500 to-emerald-500 p-2 rounded-full shadow-lg">
              <FaTruck className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
                Transporter
              </h2>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-green-600"
          >
            <FaBars />
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-2 px-4">
          {menuItems.map(({ label, icon, redirect }) => (
            <button
              key={label}
              onClick={() => (redirect ? navigate("/") : setActiveSection(label))}
              className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 ${
                activeSection === label
                  ? "bg-green-600 text-white shadow-md"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span className="text-lg mr-3">{icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium">
                  {label.replace(/([A-Z])/g, " $1").trim()}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-6 py-4 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} TruckBase TMS
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <FaSearch className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-slate-100 px-3 py-2 rounded-md text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <FaBell className="text-slate-500 hover:text-green-600 cursor-pointer" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://i.pravatar.cc/40?img=5"
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-green-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Transporter
              </span>
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Section */}
        <section className="p-6 space-y-6">{renderSection()}</section>

        {/* 🔹 Floating Chat + Overlay */}
        <FloatingChatButton unreadCount={2} onClick={() => setChatOpen(true)} />
        <ChatOverlay open={chatOpen} onClose={() => setChatOpen(false)} />
      </main>
    </div>
  );
}

