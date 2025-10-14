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
  Eye,
  Pencil,
  Trash2,
  FileText,
  Download,
} from "lucide-react";

export default function CurrentPackage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(null);
  const [imageModal, setImageModal] = useState({ open: false, src: "" });
  const navigate = useNavigate();

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
    navigate(`/UpdatePackage/${id}`);
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
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 space-y-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2 justify-center">
          <Package size={24} className="text-indigo-500" />
          Current Packages
        </h1>

        <div className="overflow-auto rounded-lg border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm text-slate-700">
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
                  <th
                    key={heading}
                    className="py-2 px-3 text-left whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="hover:bg-slate-50 transition duration-150"
                  >
                    <td className="py-2 px-3 text-center font-semibold text-slate-600">
                      {pkg.id}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800">
                      {pkg.title || "Untitled"}
                    </td>
                    <td className="py-2 px-3">
                      <div className="inline-flex items-center gap-1 text-blue-600">
                        <MapPin size={14} />
                        {pkg.pickup_location || "N/A"}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="inline-flex items-center gap-1 text-green-600">
                        <MapPin size={14} />
                        {pkg.drop_location || "N/A"}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="inline-flex items-center gap-1 text-purple-600">
                        <Weight size={14} />
                        {pkg.weight ? `${pkg.weight} kg` : "N/A"}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="inline-flex items-center gap-1 text-yellow-600">
                        <IndianRupee size={14} />
                        ₹{pkg.price_expectation || "0"}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          pkg.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : pkg.status === "Booked"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <ClipboardCheck size={12} /> {pkg.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {pkg.images ? (
                        <button
                          type="button"
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-100 transition"
                          onClick={() =>
                            setImageModal({ open: true, src: pkg.images })
                          }
                          title="View Image"
                        >
                          <Eye size={18} />
                        </button>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-slate-400 italic">
                          <ImageIcon size={14} /> No image
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-xs text-slate-500">
                      {pkg.create_at
                        ? new Date(pkg.create_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {pkg.status === "Booked" && (
                        <>
                          {!pkg.invoice ? (
                            <button
                              onClick={() => generateInvoice(pkg)}
                              disabled={invoiceLoading === pkg.id}
                              className="bg-indigo-500 text-white p-1 rounded hover:bg-indigo-600 transition"
                              title="Generate Invoice"
                            >
                              <FileText size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => downloadInvoice(pkg.invoice.id)}
                              className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition"
                              title="Download PDF"
                            >
                              <Download size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center flex justify-center gap-2">
                      {pkg.status !== "Booked" && (
                        <button
                          onClick={() => handleUpdate(pkg.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded transition"
                          title="Edit Package"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition"
                        title="Delete Package"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    className="text-center py-4 text-slate-500 italic"
                  >
                    No packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {imageModal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setImageModal({ open: false, src: "" })}
        >
          <div
            className="bg-white rounded-lg p-4 shadow-xl max-w-xs w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageModal.src}
              alt="Package"
              className="w-full h-auto rounded object-cover mb-4"
            />
            <button
              className="bg-indigo-500 mt-2 px-4 py-1 text-white rounded hover:bg-indigo-600 transition"
              onClick={() => setImageModal({ open: false, src: "" })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
