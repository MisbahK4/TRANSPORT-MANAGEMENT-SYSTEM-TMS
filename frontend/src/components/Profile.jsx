import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import { User, Mail, MapPin, Building, Phone, Globe, Edit } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-600 mb-6"></div>
          <p className="text-gray-600 animate-pulse text-lg font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">
              {error || "Failed to load user data."}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Your Profile</h1>
          <p className="text-gray-600 max-w-md mx-auto">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Section */}
          <div className="relative h-40 sm:h-48 bg-gradient-to-r from-indigo-600 to-blue-500">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-4 right-4">
              <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition">
                <Edit size={20} />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg border-4 border-white">
                  {avatarLetter}
                </div>
                <button className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50">
                  <Edit size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* User Details */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{user.username}</h2>
              <div className="flex items-center justify-center text-gray-600 mb-4">
                <Mail size={16} className="mr-1.5" />
                <span>{user.email}</span>
              </div>
              <div className="inline-flex items-center bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Active Account
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {user.company_name && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2.5 rounded-lg mr-4">
                      <Building className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Company</h3>
                      <p className="font-medium text-gray-800">{user.company_name}</p>
                    </div>
                  </div>
                </div>
              )}

              {user.phone_no && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2.5 rounded-lg mr-4">
                      <Phone className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                      <p className="font-medium text-gray-800">{user.phone_no}</p>
                    </div>
                  </div>
                </div>
              )}

              {user.address && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2.5 rounded-lg mr-4">
                      <MapPin className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                      <p className="font-medium text-gray-800">{user.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {user.state && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2.5 rounded-lg mr-4">
                      <MapPin className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">State</h3>
                      <p className="font-medium text-gray-800">{user.state}</p>
                    </div>
                  </div>
                </div>
              )}

              {user.country && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors md:col-span-2">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2.5 rounded-lg mr-4">
                      <Globe className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Country</h3>
                      <p className="font-medium text-gray-800">{user.country}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md flex items-center justify-center">
                <Edit size={18} className="mr-2" />
                Edit Profile
              </button>
              <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-300 flex items-center justify-center">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} TruckBase TMS. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Profile;