// src/pages/OwnerDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPlusSquare,
  FaTruck,
  FaHandshake,
  FaHistory,
  FaBoxOpen,
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
} from "react-icons/fa";

import Profile from "../components/Profile";
import CreatePackage from "../components/CreatePackage";
import CurrentPackage from "../components/CurrentPackages";
import NegotiationPackages from "../components/NegotiationPackages";
import PastPackages from "../components/PastPackages";
import ReadyToLoadPackages from "../components/ReadyToLoadPackages";
import LogoutButton from "../components/logout";
import FloatingChatButton from "../components/FloatingChatButton";
// import ChatOverlay from "../components/ChatOverlay";

const menuItems = [
  { label: "Profile", icon: <FaUser /> },
  { label: "MarketPlace", icon: <FaStore />, redirect: true },
  { label: "CreatePackage", icon: <FaPlusSquare /> },
  { label: "CurrentPackage", icon: <FaTruck /> },
  { label: "NegotiationPackages", icon: <FaHandshake /> },
  { label: "PastPackages", icon: <FaHistory /> },
  { label: "ReadyToLoadPackages", icon: <FaBoxOpen /> },
];

export default function OwnerDashboard() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(true); // open by default on desktop
  const [chatOpen, setChatOpen] = useState(false);
  const [activePackage, setActivePackage] = useState(null);

  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <Profile />;
      case "CreatePackage":
        return <CreatePackage />;
      case "CurrentPackage":
        return (
          <CurrentPackage
            onChatClick={(pkg) => {
              setActivePackage(pkg);
              setChatOpen(true);
            }}
          />
        );
      case "NegotiationPackages":
        return <NegotiationPackages />;
      case "PastPackages":
        return <PastPackages />;
      case "ReadyToLoadPackages":
        return <ReadyToLoadPackages />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 transform bg-white shadow-2xl border-r border-slate-200 flex flex-col transition-all duration-300
        ${sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 md:w-20"}`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 p-2 rounded-full shadow-lg">
              <FaTruck className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-400">
                Tranzio
              </h2>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-indigo-600"
          >
            {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 px-2 mt-4">
          {menuItems.map(({ label, icon, redirect }) => (
            <button
              key={label}
              onClick={() =>
                redirect ? navigate("/marketplace") : setActiveSection(label)
              }
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                activeSection === label
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              title={label}
            >
              <span className="text-lg">{icon}</span>
              {sidebarOpen && (
                <span className="ml-3 text-sm font-medium">
                  {label.replace(/([A-Z])/g, " $1").trim()}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-6 py-4 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} TruckBase TMS
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:ml-0 ml-0">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-30">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-slate-600"
            >
              <FaBars size={20} />
            </button>

            {/* Home Button */}
            <button
              onClick={() => navigate("/")}
              className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
              title="Home"
            >
              <FaHome />
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-2">
              <img
                src="https://i.pravatar.cc/40?img=3"
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-indigo-500"
              />
              <span className="hidden md:inline text-sm font-medium text-slate-700">
                Owner
              </span>
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Section Content */}
        <section className="p-4 md:p-6 space-y-6">{renderSection()}</section>

        {/* Floating Chat Button */}
        <FloatingChatButton
          unreadCount={3}
          onClick={() => {
            setActivePackage(null);
            setChatOpen(true);
          }}
        />

        {/* Chat Overlay */}
        {/* <ChatOverlay
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          packageId={activePackage?.id}
        /> */}
      </main>
    </div>
  );
}
