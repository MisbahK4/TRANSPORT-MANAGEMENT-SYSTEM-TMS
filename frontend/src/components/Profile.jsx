import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import { User, Mail, MapPin, Building, Phone, Globe } from "lucide-react";

// Reusable InfoItem component
const InfoItem = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 text-slate-700">
    <span className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
      <Icon size={18} aria-hidden="true" />
    </span>
    <span className="font-medium">{label}</span>
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Unable to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const avatarLetter = useMemo(() => user?.username?.charAt(0).toUpperCase() || "?", [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 animate-pulse text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error || "Failed to load user data."}</p>
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen px-4">
      <section
        className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-xl border border-slate-200 animate-fade-in"
        aria-label="User Profile"
      >
        {/* Avatar & Basic Info */}
        <header className="flex flex-col items-center text-center">
          <div
            className="bg-gradient-to-tr from-indigo-500 to-blue-500 text-white w-24 h-24 flex justify-center items-center rounded-full text-4xl font-bold shadow-lg"
            aria-label="User Avatar"
          >
            {avatarLetter}
          </div>
          <h2 className="text-3xl font-extrabold mt-4 text-slate-800 flex items-center gap-2">
            <User size={24} className="text-indigo-500" />
            {user.username}
          </h2>
          <p className="text-slate-600 flex items-center gap-2 mt-1 text-sm">
            <Mail size={18} className="text-blue-500" />
            {user.email}
          </p>
        </header>

        {/* Info Section */}
        <section className="mt-8 space-y-5 text-left text-sm" aria-label="Additional Info">
          {user.company_name && <InfoItem icon={Building} label={user.company_name} />}
          {user.phone_no && <InfoItem icon={Phone} label={user.phone_no} />}
          {user.address && <InfoItem icon={MapPin} label={user.address} />}
          {user.state && <InfoItem icon={MapPin} label={user.state} />}
          {user.country && <InfoItem icon={Globe} label={user.country} />}
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} TruckBase TMS
        </footer>
      </section>
    </main>
  );
};

export default Profile;

