import React, { useEffect, useState } from "react";
import API from "../../api";

const LoadedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoaded = async () => {
      try {
        const res = await API.get("/packages/loaded/");
        setPackages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoaded();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Loaded Packages
      </h1>
      {packages.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No loaded packages yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {pkg.title}
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Pickup:</span>{" "}
                  {pkg.pickup_location}
                </p>
                <p>
                  <span className="font-medium">Drop:</span>{" "}
                  {pkg.drop_location}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      pkg.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : pkg.status === "In Transit"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {pkg.status}
                  </span>
                </p>
              </div>
              {pkg.images && (
                <img
                  src={
                    pkg.images.startsWith("http")
                      ? pkg.images
                      : `${API.defaults.baseURL}${pkg.images}`
                  }
                  alt={pkg.title}
                  className="w-full h-48 object-cover rounded-md mt-4"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadedPackages;
