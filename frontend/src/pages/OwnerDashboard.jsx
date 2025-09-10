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
  FaBell,
  FaSearch,
  FaBars,
  FaHome,
} from "react-icons/fa";

import Profile from "../components/Profile";
import CreatePackage from "../components/CreatePackage";
import CurrentPackage from "../components/CurrentPackages";
import NegotiationPackages from "../components/NegotiationPackages";
import PastPackages from "../components/PastPackages";
import ReadyToLoadPackages from "../components/ReadyToLoadPackages";
import LogoutButton from "../components/logout";
import FloatingChatButton from "../components/FloatingChatButton";
import ChatOverlay from "../components/ChatOverlay";

const menuItems = [
  { label: "Home", icon: <FaHome />, redirect: true },
  { label: "Profile", icon: <FaUser /> },
  { label: "CreatePackage", icon: <FaPlusSquare /> },
  { label: "CurrentPackage", icon: <FaTruck /> },
  { label: "NegotiationPackages", icon: <FaHandshake /> },
  { label: "PastPackages", icon: <FaHistory /> },
  { label: "ReadyToLoadPackages", icon: <FaBoxOpen /> },
];

export default function OwnerDashboard() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // For Chat Overlay
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 font-sans transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white shadow-xl border-r border-slate-200 flex flex-col transition-all duration-300`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 p-2 rounded-full shadow-lg">
              <FaTruck className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-400">
                TruckBase
              </h2>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-indigo-600"
          >
            <FaBars />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 px-4">
          {menuItems.map(({ label, icon, redirect }) => (
            <button
              key={label}
              onClick={() => (redirect ? navigate("/") : setActiveSection(label))}
              className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 ${
                activeSection === label
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              title={label}
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
              className="bg-slate-100 px-3 py-2 rounded-md text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <FaBell className="text-slate-500 hover:text-indigo-600 cursor-pointer" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://i.pravatar.cc/40?img=3"
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Owner</span>
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Section Content */}
        <section className="p-6 space-y-6">{renderSection()}</section>

        {/* 🔹 Floating Chat Button */}
        <FloatingChatButton
          unreadCount={3}
          onClick={() => {
            setActivePackage(null); // show all chats list
            setChatOpen(true);
          }}
        />

        {/* 🔹 Slide-in Chat Overlay */}
        <ChatOverlay
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          packageId={activePackage?.id} // specific chat if clicked from package
        />
      </main>
    </div>
  );
}
