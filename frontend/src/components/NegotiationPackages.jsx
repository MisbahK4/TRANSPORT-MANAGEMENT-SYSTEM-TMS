import React, { useState, useEffect } from "react";
import API from "../api"; // axios instance

export default function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counterOffers, setCounterOffers] = useState({}); // track counter input

  // ✅ Fetch offers
  const fetchOffers = async () => {
    try {
      const res = await API.get("offers/"); 
      setOffers(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching offers:", err.response || err);
      setError("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ✅ Accept offer
  const handleAccept = async (id) => {
    try {
      await API.patch(`offers/${id}/`, { status: "accepted" });
      setOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "accepted" } : o))
      );
    } catch (err) {
      console.error("Error accepting offer:", err.response || err);
    }
  };

  // ✅ Reject offer
  const handleReject = async (id) => {
    try {
      await API.patch(`offers/${id}/`, { status: "rejected" });
      setOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "rejected" } : o))
      );
    } catch (err) {
      console.error("Error rejecting offer:", err.response || err);
    }
  };

  // ✅ Counter negotiation
  const handleCounter = async (id) => {
    if (!counterOffers[id]) return;
    try {
      await API.patch(`offers/${id}/`, {
        status: "pending",
        offer_price: counterOffers[id],
      });
      setOffers((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, status: "pending", offer_price: counterOffers[id] }
            : o
        )
      );
      setCounterOffers((prev) => ({ ...prev, [id]: "" })); // clear input
    } catch (err) {
      console.error("Error countering offer:", err.response || err);
    }
  };

  // ✅ Delete offer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await API.delete(`offers/${id}/`);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error deleting offer:", err.response || err);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Loading offers...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Offers</h2>

      {offers.length === 0 ? (
        <p className="text-gray-500">No offers available</p>
      ) : (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="p-4 bg-white rounded-xl shadow-md border border-gray-200"
            >
              {/* ✅ Show package image */}
              {offer.package?.images && (
                <img
                  src={offer.package.images}
                  alt={offer.package?.title || "Package"}
                  className="w-32 h-32 object-cover rounded-lg mb-3"
                />
              )}

              <p className="text-lg font-medium">
                Package:{" "}
                <span className="text-blue-600">
                  {offer.package?.title || "N/A"}
                </span>
              </p>
              <p className="text-gray-700">Price: ₹{offer.offer_price}</p>
              <p className="text-gray-700">
                Sender: {offer.sender?.username || "N/A"}
              </p>
              <p className="text-gray-700">
                Receiver: {offer.receiver?.username || "N/A"}
              </p>
              <p className="text-gray-500 text-sm">Status: {offer.status}</p>
              <p className="text-gray-400 text-xs">
                Created: {new Date(offer.created_at).toLocaleString()}
              </p>

              {/* ✅ Action buttons + Counter box */}
              {offer.status === "pending" && (
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleAccept(offer.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(offer.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg"
                  >
                    Delete
                  </button>

                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Counter Price"
                      value={counterOffers[offer.id] || ""}
                      onChange={(e) =>
                        setCounterOffers((prev) => ({
                          ...prev,
                          [offer.id]: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-2 py-1 w-32"
                    />
                    <button
                      onClick={() => handleCounter(offer.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                    >
                      Counter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
