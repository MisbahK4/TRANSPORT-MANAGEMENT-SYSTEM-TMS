import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import { User, Mail, MapPin, Building, Phone, Globe } from "lucide-react";

// Reusable InfoItem
const InfoItem = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition">
    <span className="bg-indigo-100 text-indigo-600 p-2 rounded-full shadow-sm">
      <Icon size={20} aria-hidden="true" />
    </span>
    <span className="text-slate-700 font-medium truncate">{label}</span>
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

  const avatarLetter = useMemo(
    () => user?.username?.charAt(0).toUpperCase() || "?",
    [user]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">
          {error || "Failed to load user data."}
        </p>
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen px-4">
      <section
        className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden animate-fade-in"
        aria-label="User Profile"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 h-40 relative">
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 text-white w-28 h-28 flex justify-center items-center rounded-full text-4xl font-bold shadow-md">
                {avatarLetter}
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="pt-20 pb-10 px-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-800 flex justify-center items-center gap-2">
            <User size={26} className="text-indigo-500" />
            {user.username}
          </h2>
          <p className="text-slate-600 flex justify-center items-center gap-2 mt-1 text-sm">
            <Mail size={18} className="text-blue-500" />
            {user.email}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 pb-8">
          {user.company_name && (
            <InfoItem icon={Building} label={user.company_name} />
          )}
          {user.phone_no && <InfoItem icon={Phone} label={user.phone_no} />}
          {user.address && <InfoItem icon={MapPin} label={user.address} />}
          {user.state && <InfoItem icon={MapPin} label={user.state} />}
          {user.country && <InfoItem icon={Globe} label={user.country} />}
        </div>

        {/* Footer */}
        <footer className="text-center py-4 bg-slate-50 border-t text-xs text-slate-500">
          &copy; {new Date().getFullYear()} TruckBase TMS. All rights reserved.
        </footer>
      </section>
    </main>
  );
};

export default Profile;

