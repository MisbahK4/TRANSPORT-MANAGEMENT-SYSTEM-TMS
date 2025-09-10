import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import OwnerDashboard from './pages/OwnerDashboard';
import TransporterDashboard from "./pages/TransporterDashboard";
import Marketplace from "./pages/MarketPlace";
import ChatBox from "./components/ChatBox";
import UpdatePackage from "./components/UpdatePackage";
import PrivateRoute from "./components/PrivateRoute";
import PackageDetail from "./pages/PackageDetail";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isOwner, setIsOwner] = useState(localStorage.getItem("is_owner") === "true");
  const [isTransporter, setIsTransporter] = useState(localStorage.getItem("is_transporter") === "true");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    localStorage.setItem("is_owner", isOwner);
    localStorage.setItem("is_transporter", isTransporter);
  }, [token, isOwner, isTransporter]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <LoginForm
              setToken={setToken}
              setIsOwner={setIsOwner}
              setIsTransporter={setIsTransporter}
            />
          }
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Protected Owner Dashboard */}
        <Route
          path="/owner-dashboard"
          element={
            <PrivateRoute allowedRole="owner">
              <OwnerDashboard />
            </PrivateRoute>
          }
        />

        {/* Protected Transporter Dashboard */}
        <Route
          path="/transporter-dashboard"
          element={
            <PrivateRoute allowedRole="transporter">
              <TransporterDashboard />
            </PrivateRoute>
          }
        />

        {/* Chat & Update Package (protected for any logged-in user) */}
        <Route
          path="/chat/:packageId"
          element={
            <PrivateRoute>
              <ChatBox />
            </PrivateRoute>
          }
        />
        <Route
          path="/UpdatePackage/:id"
          element={
            <PrivateRoute allowedRole="owner">
              <UpdatePackage />
            </PrivateRoute>
          }
        />
        <Route path="/packages/:id" element={<PackageDetail />} />

      </Routes>
    </Router>
  );
}

export default App;



