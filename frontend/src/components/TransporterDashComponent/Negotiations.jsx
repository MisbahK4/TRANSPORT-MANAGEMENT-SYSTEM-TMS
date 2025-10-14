import React, { useEffect, useMemo, useState } from "react";
import API from "../../api"; // axios instance

// Reusable Button component
const Button = React.memo(function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
}) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "destructive"
      ? "bg-red-500 text-white hover:bg-red-600"
      : "bg-blue-500 text-white hover:bg-blue-600";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
});

// Reusable Card component
const Card = React.memo(function Card({ children }) {
  return <div className="rounded-2xl shadow-lg p-4 bg-white border">{children}</div>;
});

export default function TransporterNegotiations() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counterOffers, setCounterOffers] = useState({}); // per-offer text value

  // Fetch offers on mount
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/offers/my_offers/");
      setOffers(res.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Update a specific offer in local state
  const updateOfferInState = (id, updates) => {
    setOffers((prev) =>
      prev.map((offer) => (offer.id === id ? { ...offer, ...updates } : offer))
    );
  };

  // Accept offer (Owner's action)
  const handleAccept = async (id) => {
    try {
      await API.post(`/offers/${id}/accept/`);
      updateOfferInState(id, { status: "accepted_by_owner" });
    } catch (error) {
      console.error("Error accepting offer:", error);
    }
  };

  // Reject offer
  const handleReject = async (id) => {
    try {
      await API.post(`/offers/${id}/reject/`);
      updateOfferInState(id, { status: "rejected" });
    } catch (error) {
      console.error("Error rejecting offer:", error);
    }
  };

  // Send counter-offer
  const handleCounter = async (id) => {
    const raw = counterOffers[id];
    const price = parseInt(raw, 10);
    if (!price || price <= 0) return alert("Enter a valid counter price");

    try {
      await API.post(`/offers/${id}/counter/`, { offer_price: price });
      updateOfferInState(id, { status: "pending", offer_price: price });
      setCounterOffers((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error sending counter offer:", error);
    }
  };

  // Transporter confirms booking
  const handleBook = async (id) => {
    try {
      await API.post(`/offers/${id}/confirm/`);
      updateOfferInState(id, { status: "confirmed_by_transporter" });
      alert("Booking confirmed!");
    } catch (error) {
      console.error("Error booking:", error);
      alert("Failed to book the package.");
    }
  };

  // Filter offers for transporter visibility
  const visibleOffers = useMemo(
    () =>
      offers.filter((o) =>
        [
          "pending",
          "countered",
          "accepted",
          "accepted_by_owner",
          "confirmed_by_transporter",
          "booked",
        ].includes(o.status)
      ),
    [offers]
  );

  // Handle counter input change (numeric only)
  const handleCounterChange = (offerId) => (e) => {
    const v = e.target.value;
    if (/^\d*$/.test(v)) {
      setCounterOffers((prev) => ({ ...prev, [offerId]: v }));
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold">Your Offers & Negotiations</h2>

      {loading ? (
        <p>Loading...</p>
      ) : visibleOffers.length === 0 ? (
        <p>No offers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleOffers.map((offer) => (
            <Card key={offer.id}>
              <div className="space-y-3">
                {offer.package?.images && (
                  <img
                    src={offer.package.images}
                    alt={offer.package?.title || "Package"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <h2 className="text-lg font-semibold">
                  Package: {offer.package?.title || "N/A"}
                </h2>
                <p>Offered Price: ₹{offer.offer_price}</p>
                <p>Status: {offer.status}</p>

                {/* Counter Input (when pending) */}
                {offer.status === "pending" && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Counter Price"
                      value={counterOffers[offer.id] ?? ""}
                      onChange={handleCounterChange(offer.id)}
                      className="border rounded-lg px-2 py-1 w-full sm:w-32"
                    />
                    <Button
                      onClick={() => handleCounter(offer.id)}
                      disabled={!counterOffers[offer.id]}
                    >
                      Counter
                    </Button>
                  </div>
                )}

                {/* Accept / Reject (pending OR countered) */}
                {(offer.status === "pending" || offer.status === "countered") && (
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleAccept(offer.id)}>Accept</Button>
                    <Button variant="destructive" onClick={() => handleReject(offer.id)}>
                      Reject
                    </Button>
                  </div>
                )}

                {/* When owner accepted offer */}
                {(offer.status === "accepted" || offer.status === "accepted_by_owner") && (
                  <>
                    <p className="text-green-600 font-semibold">
                      Offer Accepted by Owner
                    </p>
                    <Button onClick={() => handleBook(offer.id)}>Book Delivery</Button>
                  </>
                )}

                {/* When transporter confirmed booking */}
                {offer.status === "confirmed_by_transporter" && (
                  <p className="text-green-700 font-semibold">
                    Delivery booked successfully!
                  </p>
                )}

                {/* Rejected */}
                {offer.status === "rejected" && (
                  <p className="text-red-500 font-semibold">Offer Rejected</p>
                )}

                {/* Countered */}
                {offer.status === "countered" && (
                  <p className="text-yellow-600 font-semibold">
                    Owner Countered: ₹{offer.offer_price}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
