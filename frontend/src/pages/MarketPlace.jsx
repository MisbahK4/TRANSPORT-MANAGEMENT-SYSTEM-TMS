import React, { useEffect, useState, useRef } from "react";
import API from "../api"; // axios instance
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBox,
  faWeightHanging,
  faIndianRupeeSign,
  faMapMarkerAlt,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

export default function MarketPlace() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await API.get("/marketplace/");
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching marketplace:", err);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = packages.filter((pkg) => {
    const query = search.toLowerCase().trim();
    const priceMatch =
      !isNaN(query) && Number(pkg.price_expectation) === Number(query);

    return (
      pkg.title.toLowerCase().includes(query) ||
      pkg.pickup_location.toLowerCase().includes(query) ||
      pkg.drop_location.toLowerCase().includes(query) ||
      priceMatch
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.create_at) - new Date(a.create_at);
    if (sortBy === "weight") return b.weight - a.weight;
    if (sortBy === "price") return b.price_expectation - a.price_expectation;
    return 0;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPackages = sorted.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const handleCardClick = (id) => navigate(`/packages/${id}`);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <Nav />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 flex justify-center items-center gap-2">
          <FontAwesomeIcon icon={faBox} /> Explore Marketplace
        </h1>
        <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
          Find the right packages and connect instantly with owners & transporters
        </p>
      </header>

      <main className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        {/* Sticky Filter Bar */}
        <section className="sticky top-0 bg-white z-30 py-3 mb-6 shadow-md rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 max-w-5xl mx-auto px-2">
            {/* Search */}
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search packages..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-full pl-10 pr-3 py-2 sm:py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
                aria-label="Search packages"
              />
            </div>

            {/* Custom Sorting Dropdown */}
            <div className="relative w-full sm:w-52" ref={dropdownRef}>
              <button
                onClick={() => setSortOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faSort} className="text-indigo-500" />
                  {sortBy === "latest" && "Latest"}
                  {sortBy === "weight" && "Weight"}
                  {sortBy === "price" && "Price"}
                </span>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`ml-2 transform transition-transform ${
                    sortOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {sortOpen && (
                <ul className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-sm sm:text-base">
                  <li
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSortBy("latest");
                      setSortOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faBox} className="text-indigo-500" />{" "}
                    Latest
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSortBy("weight");
                      setSortOpen(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faWeightHanging}
                      className="text-indigo-500"
                    />{" "}
                    Weight
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSortBy("price");
                      setSortOpen(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="text-indigo-500"
                    />{" "}
                    Price
                  </li>
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Package Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 flex-grow">
          {currentPackages.length > 0 ? (
            currentPackages.map((pkg) => (
              <article
                key={pkg.id}
                onClick={() => handleCardClick(pkg.id)}
                className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
              >
                {pkg.images ? (
                  <img
                    src={
                      pkg.images.startsWith("http")
                        ? pkg.images
                        : `${API.defaults.baseURL}${pkg.images}`
                    }
                    alt={pkg.title}
                    className="w-full h-32 sm:h-44 md:h-48 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-32 sm:h-44 md:h-48 bg-indigo-50 flex items-center justify-center text-indigo-300 text-xs sm:text-sm">
                    <FontAwesomeIcon icon={faBox} size="lg" /> No Image
                  </div>
                )}

                <div className="p-3 sm:p-5 flex flex-col flex-grow">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate mb-1 sm:mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBox} /> {pkg.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {pkg.pickup_location}
                    <FontAwesomeIcon icon={faArrowRight} /> {pkg.drop_location}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-indigo-700 font-bold text-sm sm:text-lg flex items-center gap-1">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />
                        {pkg.price_expectation.toLocaleString()}
                      </span>
                      <time
                        className="block text-xs text-gray-400 mt-0.5 sm:mt-1"
                        dateTime={new Date(pkg.create_at).toISOString()}
                      >
                        {new Date(pkg.create_at).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="bg-indigo-100 text-indigo-700 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                      <FontAwesomeIcon icon={faWeightHanging} /> {pkg.weight} kg
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full mt-20 text-base sm:text-lg font-medium">
              No packages found.
            </p>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex justify-center items-center mt-10 gap-1 sm:gap-3"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border bg-white text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-xs sm:text-sm flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              const isCurrent = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border shadow-sm text-xs sm:text-sm ${
                    isCurrent
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border bg-white text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-xs sm:text-sm flex items-center gap-1"
            >
              Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </nav>
        )}
      </main>

      <Footer />
    </>
  );
}



