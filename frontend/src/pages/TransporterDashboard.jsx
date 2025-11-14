import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaUsers,
  FaHome,
  FaStore,
  FaHandshake,
  FaBox,
  FaShippingFast,
  FaBars,
  FaSearch,
  FaBell,
  FaStar,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";

import LogoutButton from "../components/logout";

// transporter sections
import VehicleForm from "../components/TransporterDashComponent/Vehicles";
import StaffForm from "../components/TransporterDashComponent/Staff";
import CurrentDeliveries from "../components/TransporterDashComponent/CurrentDeliveries";
import LoadedPackages from "../components/TransporterDashComponent/LoadedPackages";
import ManageVehicleStaff from "../components/TransporterDashComponent/ManageStaffVehicals";
import Profile from "../components/Profile";
import Marketplace from "../pages/MarketPlace";
import TransporterNegotiations from "../components/TransporterDashComponent/Negotiations";

// ✅ Updated menuItems without Home
const menuItems = [
  { label: "Profile", icon: <FaUserCircle /> },
  { label: "MarketPlace", icon: <FaStore />, redirect: true, path: "/marketplace" },
  { label: "Vehicles", icon: <FaTruck /> },
  { label: "Staff", icon: <FaUsers /> },
  { label: "Manage Staff Vehicals", icon: <FaStar /> },
  { label: "Negotiations", icon: <FaHandshake /> },
  { label: "CurrentDeliveries", icon: <FaBox /> },
  { label: "LoadedPackages", icon: <FaShippingFast /> },
];

export default function TransporterDashboard() {
  const [activeSection, setActiveSection] = useState("Vehicles");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "Profile": return <Profile />;
      case "Market Place": return <Marketplace />;
      case "Vehicles": return <VehicleForm />;
      case "Staff": return <StaffForm />;
      case "Manage Staff Vehicals": return <ManageVehicleStaff />;
      case "Negotiations": return <TransporterNegotiations />;
      case "CurrentDeliveries": return <CurrentDeliveries />;
      case "LoadedPackages": return <LoadedPackages />;
      default: return <VehicleForm />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 font-sans transition-all duration-300">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-20"} fixed md:translate-x-0 z-50 md:z-auto md:static bg-white shadow-xl border-r border-slate-200 flex flex-col transition-all duration-300 h-screen md:h-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-green-500 to-emerald-500 p-2 rounded-full shadow-lg">
              <FaTruck className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
                Transporter
              </h2>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-green-600"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-2 px-2 sm:px-4 flex-1 overflow-y-auto">
          {menuItems.map(({ label, icon, redirect, path }) => (
            <button
              key={label}
              onClick={() => {
                if (redirect) {
                  navigate(path);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                } else {
                  setActiveSection(label);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }
              }}
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
        {sidebarOpen && (
          <div className="px-4 sm:px-6 py-4 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Tranzio
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-slate-500 hover:text-green-600"
            >
              <FaBars />
            </button>
            {/* Home button for navigation */}
            <button
              onClick={() => navigate("/")}
              className="text-slate-500 hover:text-green-600"
              title="Go to Homepage"
            >
              <FaHome />
            </button>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="hidden sm:flex items-center space-x-2">
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
        <section className="p-4 sm:p-6 space-y-6 overflow-x-auto">
          {renderSection()}
        </section>
      </main>
    </div>
  );
}
