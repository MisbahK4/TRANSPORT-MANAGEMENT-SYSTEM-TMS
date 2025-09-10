import React, { useState, useEffect } from "react";
import API from "../../api";
import {
  FaTrash,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaWeightHanging,
  FaTruckLoading,
  FaImage,
} from "react-icons/fa";

export default function CurrentPackage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const fetchCurrentDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) return setError("No token found");

      const res = await API.get("/packages/current_deliveries/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching current deliveries:", err.response || err);
      setError("Failed to fetch current deliveries.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/packages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    } catch (err) {
      console.error("Error deleting package:", err.response || err);
      alert("Failed to delete package.");
    }
  };

  // NEW: Mark as Loaded
  const markLoaded = async (id) => {
    if (!window.confirm("Mark this package as Loaded?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/packages/${id}/mark_loaded/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === id ? { ...pkg, status: "Loaded" } : pkg))
      );

      alert("Package marked as Loaded!");
    } catch (err) {
      console.error("Error marking package as loaded:", err.response || err);
      alert("Failed to mark package as Loaded.");
    }
  };

  useEffect(() => {
    fetchCurrentDeliveries();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-2">
        <FaTruckLoading className="text-3xl animate-bounce" />
        <p>Loading current deliveries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-2">
        <FaBoxOpen className="text-3xl" />
        <p>No current deliveries found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700 flex items-center justify-center gap-2">
        <FaTruckLoading /> Current Deliveries
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-indigo-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-center">#</th>
              <th className="px-4 py-2 text-center">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Pickup</th>
              <th className="px-4 py-2 text-left">Drop</th>
              <th className="px-4 py-2 text-left">Weight</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-100">
            {packages.map((pkg, index) => {
              let pkgUserId = pkg.user?.id || Number(pkg.user);
              const transporterId = pkg.transporter?.id || Number(pkg.transporter);
              const currentUserId = currentUser?.id || currentUser?.user?.id || null;
              const isAdmin = currentUser?.is_superuser || currentUser?.is_staff;
              const canDelete = pkgUserId === currentUserId || transporterId === currentUserId || isAdmin;

              return (
                <tr key={pkg.id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-2 text-center font-medium">{index + 1}</td>

                  <td className="px-4 py-2 text-center">
                    {pkg.images ? (
                      <img
                        src={pkg.images}
                        alt={pkg.title || "Package"}
                        className="h-10 w-10 object-cover rounded shadow border mx-auto"
                      />
                    ) : (
                      <FaImage className="text-gray-400 mx-auto text-xl" />
                    )}
                  </td>

                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">{pkg.title || "Untitled"}</td>

                  <td className="px-4 py-2 text-left text-gray-700 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span>{pkg.pickup_location || "N/A"}</span>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-left text-gray-700 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <FaMapMarkerAlt className="text-green-500" />
                      <span>{pkg.drop_location || "N/A"}</span>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <FaWeightHanging className="text-gray-500" />
                      <span>{pkg.weight ? `${pkg.weight} kg` : "N/A"}</span>
                    </div>
                  </td>

                  <td className={`px-4 py-2 text-left whitespace-nowrap font-semibold ${pkg.price_expectation ? "text-green-600" : "text-gray-500 italic"}`}>
                    {pkg.price_expectation ? `₹${pkg.price_expectation}` : "N/A"}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pkg.status?.toLowerCase() === "booked" ? "bg-green-100 text-green-700" : pkg.status?.toLowerCase() === "available" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {pkg.status || "Unknown"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center flex flex-col gap-2 items-center">
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                      >
                        <FaTrash /> Delete
                      </button>
                    )}

                    {pkg.status !== "Loaded" && (
                      <button
                        onClick={() => markLoaded(pkg.id)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow transition"
                      >
                        <FaTruckLoading /> Ready To Load
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
