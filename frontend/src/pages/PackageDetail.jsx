import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { CheckCircle, Send, MessageCircle, X } from "lucide-react";
import Modal from "react-modal";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

Modal.setAppElement("#root"); // Accessibility

const Button = ({ children, onClick, disabled, variant = "primary" }) => {
  const base =
    "rounded-full px-5 py-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-1 font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base transform hover:-translate-y-0.5";
  const styles = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-blue-300 disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed",
    success:
      "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white focus:ring-emerald-300 disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${disabled ? "bg-gray-300 text-white cursor-not-allowed" : styles[variant]}`}
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
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleRequireLogin = () => setModalOpen(true);

  const handleFirstOffer = async () => {
    if (!isLoggedIn) return handleRequireLogin();
    if (!offer || isNaN(offer) || Number(offer) <= 0) {
      setMsg({ type: "error", text: "Please enter a valid offer amount." });
      return;
    }
    try {
      await API.post("/offers/", { package_id: id, offer_price: offer });
      setMsg({ type: "success", text: "✅ Offer submitted successfully!" });
      setOffer("");
    } catch (err) {
      console.error("Offer error:", err.response?.data || err);
      setMsg({ type: "error", text: "❌ Failed to submit offer." });
    }
  };

  const handleBook = async () => {
    if (!isLoggedIn) return handleRequireLogin();
    try {
      await API.post(`/packages/${id}/book/`);
      setPkg((prev) => ({ ...prev, status: "Booked" }));
      setMsg({ type: "success", text: "✅ Package booked successfully!" });
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err);
      setMsg({ type: "error", text: "❌ Booking failed." });
    }
  };

  const handleChat = () => {
    if (!isLoggedIn) return handleRequireLogin();
    navigate(`/chat/${id}`);
  };

  if (loading)
    return (
      <div className="bg-gradient-to-b from-indigo-100 via-white to-indigo-50 min-h-screen flex items-center justify-center p-6 font-sans text-gray-700 animate-pulse">
        Loading package...
      </div>
    );

  if (!pkg)
    return (
      <div className="bg-gradient-to-b from-red-100 to-red-50 min-h-screen flex items-center justify-center p-6 font-sans text-red-600">
        Package not found.
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-white to-indigo-50 min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <Nav />

      {/* Login Required Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative outline-none animate-fadeIn"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={() => setModalOpen(false)}
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Login Required</h2>
        <p className="text-gray-700 mb-6 text-center text-base leading-relaxed">
          You need to login to make offers, book packages, or chat with transporters.
          Enjoy a safe and seamless experience by signing in now.
        </p>
        <Button
          onClick={() => navigate("/login")}
          variant="primary"
        >
          ✅ Login & Continue
        </Button>
      </Modal>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl animate-fadeIn mt-6 mb-6">
        {/* Message Alert */}
        {msg && (
          <div
            className={`mb-6 rounded-lg px-5 py-3 text-sm sm:text-base ${
              msg.type === "success"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
            role="alert"
          >
            {msg.text}
          </div>
        )}

        {/* Top Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="border rounded-2xl p-4 flex items-center justify-center bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-2xl transition-all duration-300">
            {pkg.images ? (
              <img
                src={pkg.images.startsWith("http") ? pkg.images : `${API.defaults.baseURL}${pkg.images}`}
                alt={pkg.title}
                className="max-h-96 w-full object-contain rounded-xl transform hover:scale-105 transition duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-xl text-gray-400 text-lg select-none">
                No Image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-3">{pkg.title}</h1>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Posted on {new Date(pkg.create_at).toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                From: {pkg.pickup_location}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium text-sm">
                To: {pkg.drop_location}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium text-sm">
                Weight: {pkg.weight} kg
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mb-4 flex items-center gap-2">
              ₹{pkg.price_expectation}
              <span className="text-gray-400 text-sm sm:text-base font-normal">expected</span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{pkg.description}</p>

            {/* Offer Section */}
            <label htmlFor="offer" className="block text-sm font-medium text-gray-700 mb-2">
              Your Offer (₹)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                id="offer"
                type="number"
                min="0"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Enter your offer"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition text-sm sm:text-base shadow-sm"
              />
              <Button onClick={handleFirstOffer} disabled={!offer || Number(offer) <= 0} variant="primary">
                <Send className="w-4 h-4" />
                Submit Offer
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {pkg.status === "Booked" ? (
                <Button variant="success" disabled>
                  <CheckCircle className="w-5 h-5" />
                  Booked
                </Button>
              ) : (
                <Button onClick={handleBook} variant="success">
                  <CheckCircle className="w-5 h-5" />
                  Book Now
                </Button>
              )}
              <Button onClick={handleChat} variant="primary">
                <MessageCircle className="w-5 h-5" />
                Start Chat
              </Button>
            </div>
          </div>
        </section>

        {/* Additional Details */}
        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-3">Additional Details</h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            This section can include more specifications, transporter requirements,
            special instructions, or important notes.
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
