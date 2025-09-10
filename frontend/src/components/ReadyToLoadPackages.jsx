import React, { useEffect, useState } from "react";
import API from "../api";

export default function ReadyToLoadPackages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    API.get("/packages/loaded/")
      .then((res) => {
        setPackages(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Loaded Packages</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left">Title</th>
              <th className="px-6 py-3 border-b text-left">Pickup</th>
              <th className="px-6 py-3 border-b text-left">Drop</th>
              <th className="px-6 py-3 border-b text-left">Weight</th>
              <th className="px-6 py-3 border-b text-left">Price</th>
              <th className="px-6 py-3 border-b text-left">Status</th>
              <th className="px-6 py-3 border-b text-left">Image</th>
            </tr>
          </thead>
          <tbody>
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b">{pkg.title}</td>
                  <td className="px-6 py-3 border-b">{pkg.pickup_location}</td>
                  <td className="px-6 py-3 border-b">{pkg.drop_location}</td>
                  <td className="px-6 py-3 border-b">{pkg.weight} kg</td>
                  <td className="px-6 py-3 border-b">₹{pkg.price_expectation}</td>
                  <td className="px-6 py-3 border-b text-blue-600 font-semibold">
                    {pkg.status}
                  </td>
                  <td className="px-6 py-3 border-b">
                    {pkg.images ? (
                      <img
                        src={
                          pkg.images.startsWith("http")
                            ? pkg.images
                            : `${API.defaults.baseURL}${pkg.images}`
                        }
                        alt={pkg.title}
                        className="h-16 w-16 object-cover rounded-md border"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-3 border-b text-center text-gray-500"
                >
                  No loaded packages available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
