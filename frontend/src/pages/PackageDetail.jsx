import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { CheckCircle, Send, MessageCircle } from "lucide-react";

const Button = ({ children, onClick, disabled, variant = "primary" }) => {
  const base =
    "rounded-full px-5 py-2 shadow focus:outline-none focus:ring-2 focus:ring-offset-1 font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm";
  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300 disabled:bg-slate-300 disabled:text-white disabled:cursor-not-allowed",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-300 disabled:bg-slate-300 disabled:text-white disabled:cursor-not-allowed",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${disabled ? styles.primary.replace(
        /bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300/,
        "bg-slate-300 text-white cursor-not-allowed"
      ) : styles[variant]}`}
      type="button"
    >
      {children}
    </button>
  );
};

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState("");
  const [msg, setMsg] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await API.get(`/marketplace/${id}/`);
        setPkg(res.data);
      } catch (err) {
        console.error("Failed to fetch package:", err);
        setPkg(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const handleFirstOffer = async () => {
    if (!offer || isNaN(offer) || Number(offer) <= 0) {
      setMsg({ type: "error", text: "Please enter a valid offer amount." });
      return;
    }
    try {
      await API.post("/offers/", { package_id: id, offer_price: offer });
      setMsg({ type: "success", text: "✅ Offer submitted!" });
      setOffer("");
    } catch (err) {
      console.error("Offer error:", err.response?.data || err);
      setMsg({ type: "error", text: "❌ Failed to submit offer." });
    }
  };

  const handleBook = async () => {
    try {
      await API.post(`/packages/${id}/book/`);
      setPkg((prev) => ({ ...prev, status: "Booked" }));
      setMsg({ type: "success", text: "✅ Package booked!" });
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err);
      setMsg({ type: "error", text: "❌ Booking failed." });
    }
  };

  const handleChat = () => {
    navigate(`/chat/${id}`);
  };

  if (loading)
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6 font-sans text-slate-700">
        Loading package...
      </div>
    );

  if (!pkg)
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6 font-sans text-red-600">
        Package not found.
      </div>
    );

  return (
    <div className="bg-slate-50 min-h-screen font-sans py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Message Alert */}
        {msg && (
          <div
            className={`mb-6 rounded-md px-4 py-3 ${
              msg.type === "success"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
            role="alert"
          >
            {msg.text}
          </div>
        )}

        {/* Top Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="border rounded-lg p-4 flex items-center justify-center bg-white">
            {pkg.images ? (
              <img
                src={
                  pkg.images.startsWith("http")
                    ? pkg.images
                    : `${API.defaults.baseURL}${pkg.images}`
                }
                alt={pkg.title}
                className="max-h-96 object-contain rounded-md"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-md text-slate-400 text-lg select-none">
                No Image
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold text-slate-800 mb-2">{pkg.title}</h1>
            <p className="text-sm text-slate-500 mb-4">
              Posted on {new Date(pkg.create_at).toLocaleString()}
            </p>

            <p className="text-lg text-slate-700 mb-1">
              <span className="font-medium">From:</span> {pkg.pickup_location}
            </p>
            <p className="text-lg text-slate-700 mb-1">
              <span className="font-medium">To:</span> {pkg.drop_location}
            </p>
            <p className="text-lg text-slate-700 mb-4">
              <span className="font-medium">Weight:</span> {pkg.weight} kg
            </p>

            <div className="text-2xl font-bold text-emerald-600 mb-2">
              ₹{pkg.price_expectation}
              <span className="text-slate-400 text-sm font-normal ml-2">expected</span>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">{pkg.description}</p>

            {/* Offer Section */}
            <label
              htmlFor="offer"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Your Offer (₹)
            </label>
            <div className="flex gap-3 mb-6">
              <input
                id="offer"
                type="number"
                min="0"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Enter your offer"
                className="flex-1 rounded border border-slate-300 px-4 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                aria-label="Enter your offer price"
              />
              <Button
                onClick={handleFirstOffer}
                disabled={!isLoggedIn || !offer || Number(offer) <= 0}
                variant="primary"
              >
                <Send className="w-4 h-4" />
                Submit
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {pkg.status === "Booked" ? (
                <Button variant="success" disabled>
                  <CheckCircle className="w-4 h-4" />
                  Booked
                </Button>
              ) : (
                <Button onClick={handleBook} disabled={!isLoggedIn} variant="success">
                  <CheckCircle className="w-4 h-4" />
                  Book Now
                </Button>
              )}

              <Button onClick={handleChat} disabled={!isLoggedIn} variant="primary">
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
            </div>
          </div>
        </section>

        {/* Lower Section */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Additional Details</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            This section can include more specifications, transporter requirements,
            special instructions, etc.
          </p>
        </section>
      </main>
    </div>
  );
}
