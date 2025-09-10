import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
  Package,
  MapPin,
  Weight,
  IndianRupee,
  ClipboardCheck,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";

export default function CurrentPackage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(null);
  const navigate = useNavigate(); // ✅ for navigation

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/packages/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/packages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete package");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/UpdatePackage/${id}`); // ✅ React Router navigation
  };

  const generateInvoice = async (pkg) => {
    if (!window.confirm("Generate invoice for this package?")) return;

    setInvoiceLoading(pkg.id);
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/invoices/generate/",
        {
          package_id: pkg.id,
          amount: pkg.price_expectation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Invoice generated successfully!");
      fetchPackages();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to generate invoice");
    } finally {
      setInvoiceLoading(null);
    }
  };

  const downloadInvoice = (invoiceId) => {
    const url = `/api/invoices/${invoiceId}/download_pdf/`;
    window.open(url, "_blank");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-center py-5 text-slate-500 animate-pulse text-lg">
          Loading packages...
        </p>
      </div>
    );

  return (
    <div>
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3 justify-center">
          <Package size={28} className="text-indigo-500" />
          Current Packages
        </h1>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-md">
          <table className="min-w-[1000px] w-full bg-white text-sm text-slate-700">
            <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
              <tr className="uppercase text-xs text-slate-500 tracking-wide">
                {[
                  "ID",
                  "Title",
                  "Pickup",
                  "Drop",
                  "Weight",
                  "Price",
                  "Status",
                  "Image",
                  "Created",
                  "Invoice",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="py-3 px-4 text-left whitespace-nowrap">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition duration-200">
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">{pkg.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{pkg.title || "Untitled"}</td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-2 text-blue-600">
                        <MapPin size={16} />
                        {pkg.pickup_location || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-2 text-green-600">
                        <MapPin size={16} />
                        {pkg.drop_location || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-2 text-purple-600">
                        <Weight size={16} />
                        {pkg.weight ? `${pkg.weight} kg` : "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-2 text-yellow-600">
                        <IndianRupee size={16} />
                        ₹{pkg.price_expectation || "0"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          pkg.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : pkg.status === "Booked"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <ClipboardCheck size={14} /> {pkg.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {pkg.images ? (
                        <img
                          src={pkg.images}
                          alt={pkg.title}
                          className="h-10 w-10 object-cover rounded border shadow mx-auto"
                        />
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-slate-400 italic">
                          <ImageIcon size={16} /> No image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 text-nowrap">
                      {pkg.create_at ? new Date(pkg.create_at).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {pkg.status === "Booked" && (
                        <>
                          {!pkg.invoice ? (
                            <button
                              onClick={() => generateInvoice(pkg)}
                              disabled={invoiceLoading === pkg.id}
                              className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-xs transition"
                            >
                              {invoiceLoading === pkg.id ? "Generating..." : "Generate Invoice"}
                            </button>
                          ) : (
                            <button
                              onClick={() => downloadInvoice(pkg.invoice.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs transition"
                            >
                              Download PDF
                            </button>
                          )}
                        </>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        {/* ✅ Only show update if NOT booked */}
                        {pkg.status !== "Booked" && (
                          <button
                            onClick={() => handleUpdate(pkg.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 text-xs transition"
                          >
                            <Pencil size={14} /> Update
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs transition"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-6 text-slate-500 italic">
                    No packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
