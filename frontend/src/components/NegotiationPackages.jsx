import React, { useState, useEffect } from "react";
import API from "../api";

export default function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterOffers, setCounterOffers] = useState({});
  const [now, setNow] = useState(Date.now());
  const [confirmModal, setConfirmModal] = useState({ open: false, offer: null });

  const fetchOffers = async () => {
    try {
      const res = await API.get("offers/");
      setOffers(res.data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // update timer every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // auto expire accepted offers
  useEffect(() => {
    offers.forEach(async (offer) => {
      if (
        offer.status === "accepted_by_owner" &&
        offer.valid_until &&
        new Date(offer.valid_until) <= new Date()
      ) {
        try {
          await API.post(`offers/${offer.id}/expire_and_unlock/`);
          fetchOffers();
        } catch (err) {
          console.error("Error expiring offer:", err);
        }
      }
    });
  }, [now, offers]);

  const handleAccept = (offer) => {
    setConfirmModal({ open: true, offer });
  };

  const confirmAccept = async () => {
    try {
      await API.post(`offers/${confirmModal.offer.id}/accept/`);
      fetchOffers();
    } catch (err) {
      console.error("Error accepting offer:", err);
    } finally {
      setConfirmModal({ open: false, offer: null });
    }
  };

  const handleReject = async (offer) => {
    try {
      await API.post(`offers/${offer.id}/reject/`);
      fetchOffers();
    } catch (err) {
      console.error("Error rejecting offer:", err);
    }
  };

  const handleCounter = async (offer) => {
    const price = counterOffers[offer.id];
    if (!price) return alert("Enter a counter price first!");
    try {
      await API.post(`offers/${offer.id}/counter/`, { offer_price: price });
      setCounterOffers({ ...counterOffers, [offer.id]: "" });
      fetchOffers();
    } catch (err) {
      console.error("Error sending counter:", err);
    }
  };

  const handleDelete = async (offerId) => {
    const confirmDelete = window.confirm("Delete this offer permanently?");
    if (!confirmDelete) return;
    try {
      await API.delete(`offers/${offerId}/`);
      fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };

  const getTimeRemaining = (valid_until) => {
    if (!valid_until) return "";
    const diff = new Date(valid_until) - new Date();
    if (diff <= 0) return "Expired";
    const mins = Math.floor(diff / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return { text: `${mins}m ${secs < 10 ? "0" : ""}${secs}s`, diff };
  };

  if (loading)
    return <p className="text-center mt-4 text-gray-500">Loading offers...</p>;

  return (
    <div className="p-4 sm:p-6 transition-all duration-300 ease-in-out">
      <div
        className="
          grid gap-6
          grid-cols-1 
          sm:grid-cols-2 
          xl:grid-cols-3
          2xl:grid-cols-4
          auto-rows-max
          transition-all duration-300
        "
      >
        {offers.map((offer) => {
          const isExpired =
            offer.valid_until && new Date(offer.valid_until) <= new Date();
          const canTakeAction =
            (offer.status === "pending" || offer.status === "reopened") &&
            !isExpired;

          const timer = getTimeRemaining(offer.valid_until);
          const timerColor =
            timer.diff <= 60000
              ? "text-red-600 font-bold animate-pulse"
              : "text-gray-600";

          return (
            <div
              key={offer.id}
              className="
                bg-white border rounded-xl shadow-md hover:shadow-xl 
                transition-all duration-300 ease-in-out 
                transform hover:-translate-y-1
                flex flex-col justify-between
                overflow-visible
              "
            >
              {offer.package?.images && (
                <img
                  src={offer.package.images}
                  alt={offer.package.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                    {offer.package?.title || "Unnamed Package"}
                  </h3>
                  <p className="text-gray-700 mb-1">
                    Price Offered: ₹{offer.offer_price}
                  </p>
                  <p className="text-sm mb-2">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        offer.status === "accepted_by_owner"
                          ? "text-blue-600"
                          : offer.status === "confirmed_by_transporter"
                          ? "text-green-600"
                          : offer.status === "rejected"
                          ? "text-red-600"
                          : offer.status === "reopened"
                          ? "text-yellow-600"
                          : "text-gray-800"
                      }`}
                    >
                      {offer.status}
                    </span>
                  </p>

                  {offer.status === "accepted_by_owner" && (
                    <p className={`text-sm mt-1 ${timerColor}`}>
                      Time Left: {timer.text}
                    </p>
                  )}
                </div>

                {canTakeAction && (
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex flex-wrap gap-2 justify-start">
                      <button
                        onClick={() => handleAccept(offer)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(offer)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Reject
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1">
                      <input
                        type="number"
                        value={counterOffers[offer.id] || ""}
                        onChange={(e) =>
                          setCounterOffers({
                            ...counterOffers,
                            [offer.id]: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 flex-grow min-w-[120px] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Counter price"
                      />
                      <button
                        onClick={() => handleCounter(offer)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Counter
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(offer.id)}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg mt-4 w-full transition-all duration-200 transform hover:scale-105"
                >
                  Delete
                </button>

                {isExpired && (
                  <p className="mt-3 text-sm text-red-600 font-medium animate-pulse">
                    ⏰ Offer Expired — You can accept other offers now.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Confirm Acceptance</h2>
            <p className="mb-4">
              Are you sure you want to accept the offer ₹
              {confirmModal.offer.offer_price} for{" "}
              {confirmModal.offer.package?.title || "this package"}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, offer: null })}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAccept}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



