import React, { useEffect, useMemo, useState } from "react";
import API from "../../api"; // axios instance

// ---- Keep these OUTSIDE so their identity doesn't change between renders ----
const Button = React.memo(function Button({ children, onClick, variant = "primary", disabled }) {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed";
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

const Card = React.memo(function Card({ children }) {
  return <div className="rounded-2xl shadow-lg p-4 bg-white border">{children}</div>;
});
// -----------------------------------------------------------------------------

export default function TransporterNegotiations() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counterOffers, setCounterOffers] = useState({}); // per-offer text value

  // Fetch offers only once on mount
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

  // --- Local state updates instead of re-fetch ---
  const updateOfferInState = (id, updates) => {
    setOffers((prev) =>
      prev.map((offer) => (offer.id === id ? { ...offer, ...updates } : offer))
    );
  };

  // Accept offer
  const handleAccept = async (id) => {
    try {
      await API.post(`/offers/${id}/accept/`);
      updateOfferInState(id, { status: "accepted" });
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

  // Counter offer
  const handleCounter = async (id) => {
    const raw = counterOffers[id];
    const price = parseInt(raw, 10);
    if (!price || price <= 0) return alert("Enter a valid counter price");

    try {
      await API.post(`/offers/${id}/counter/`, { offer_price: price });
      updateOfferInState(id, { status: "countered", offer_price: price });
      setCounterOffers((prev) => ({ ...prev, [id]: "" })); // clear only that input
    } catch (error) {
      console.error("Error sending counter offer:", error);
    }
  };

  // Book offer
  const handleBook = async (id) => {
    try {
      await API.post(`/offers/${id}/book/`);
      updateOfferInState(id, { status: "booked" });
      alert("Booking confirmed!");
    } catch (error) {
      console.error("Error booking:", error);
      alert("Failed to book the package.");
    }
  };

  // Filter once per offers change
  const pendingOffers = useMemo(
    () =>
      offers.filter(
        (o) =>
          o.status === "pending" ||
          o.status === "countered" ||
          o.status === "accepted"
      ),
    [offers]
  );

  // Stable onChange handler per offer to keep input focused
  const handleCounterChange = (offerId) => (e) => {
    const v = e.target.value;
    // allow only digits (so typing doesn't get rejected mid-way)
    if (/^\d*$/.test(v)) {
      setCounterOffers((prev) => ({ ...prev, [offerId]: v }));
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold">Your Offers & Negotiations</h2>

      {loading ? (
        <p>Loading...</p>
      ) : pendingOffers.length === 0 ? (
        <p>No offers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingOffers.map((offer) => (
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

                {/* Counter input (only when pending) */}
                {offer.status === "pending" && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                    <input
                      // Do NOT set a changing key here; keep the DOM node stable
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Counter Price"
                      value={counterOffers[offer.id] ?? ""}
                      onChange={handleCounterChange(offer.id)}
                      className="border rounded-lg px-2 py-1 w-full sm:w-32"
                    />
                    <Button onClick={() => handleCounter(offer.id)} disabled={!counterOffers[offer.id]}>
                      Counter
                    </Button>
                  </div>
                )}

                {/* Accept / Reject (for pending AND countered) */}
                {(offer.status === "pending" || offer.status === "countered") && (
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleAccept(offer.id)}>Accept</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(offer.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {/* Accepted / Rejected / Countered messages */}
                {offer.status === "accepted" && (
                  <>
                    <p className="text-green-600 font-semibold">
                      Offer Accepted by Owner
                    </p>
                    <Button onClick={() => handleBook(offer.id)}>
                      Book Delivery
                    </Button>
                  </>
                )}
                {offer.status === "rejected" && (
                  <p className="text-red-500 font-semibold">Offer Rejected</p>
                )}
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


