import React, { useEffect, useState } from "react";
import API from "../api";

export default function PastPackages() {
  const [pastPackages, setPastPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPastPackages();
  }, []);

  const fetchPastPackages = async () => {
    try {
      const response = await API.get("/packages/?status=delivered");
      setPastPackages(response.data);
    } catch (error) {
      console.error("Error fetching past packages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Past Packages</h2>
        <p className="text-gray-600 mb-6">Packages that have been successfully delivered.</p>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          {loading ? (
            <div className="p-6 text-center text-gray-500 animate-pulse">Loading past packages...</div>
          ) : pastPackages.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Pickup</th>
                  <th className="px-6 py-3 text-left">Drop</th>
                  <th className="px-6 py-3 text-left">Weight</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Delivered On</th>
                  <th className="px-6 py-3 text-left">Image</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {pastPackages.map((pkg, index) => (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{pkg.title}</td>
                    <td className="px-6 py-4">{pkg.pickup_location}</td>
                    <td className="px-6 py-4">{pkg.drop_location}</td>
                    <td className="px-6 py-4">{pkg.weight} kg</td>
                    <td className="px-6 py-4">₹{pkg.price_expectation}</td>
                    <td className="px-6 py-4">
                      {pkg.delivered_at
                        ? new Date(pkg.delivered_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {pkg.images ? (
                        <img
                          src={pkg.images}
                          alt="package"
                          className="h-16 w-16 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <img
                src="https://www.svgrepo.com/show/331984/empty-box.svg"
                alt="No packages"
                className="mx-auto h-24 mb-4 opacity-60"
              />
              No past packages found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
