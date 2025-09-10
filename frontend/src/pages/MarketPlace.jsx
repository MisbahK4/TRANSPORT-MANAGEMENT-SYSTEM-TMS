import React, { useEffect, useState } from "react";
import API from "../api"; // axios instance
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function MarketPlace() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

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

  // Filter packages by search query (title, pickup, drop, exact price)
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

  // Sort filtered packages
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.create_at) - new Date(a.create_at);
    if (sortBy === "weight") return b.weight - a.weight;
    if (sortBy === "price") return b.price_expectation - a.price_expectation;
    return 0;
  });

  // Pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPackages = sorted.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  // Navigate to package detail page
  const handleCardClick = (id) => navigate(`/packages/${id}`);

  // Change page with bounds check
  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <Nav />
      <main className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">
          Market Place
        </h1>

        {/* Sticky Filter Bar */}
        <section className="sticky top-0 bg-white z-20 py-4 mb-8 shadow-sm rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-4 max-w-4xl mx-auto px-2">
            <input
              type="text"
              placeholder="Search by title, pickup, drop, or price..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
              className="border border-gray-300 rounded-lg px-4 py-3 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              aria-label="Search packages"
              autoComplete="off"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 md:w-48 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              aria-label="Sort packages"
            >
              <option value="latest">Latest</option>
              <option value="weight">Weight</option>
              <option value="price">Price</option>
            </select>
          </div>
        </section>

        {/* Package Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow">
          {currentPackages.length > 0 ? (
            currentPackages.map((pkg) => (
              <article
                key={pkg.id}
                onClick={() => handleCardClick(pkg.id)}
                className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden flex flex-col focus:outline-none focus:ring-4 focus:ring-indigo-300"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCardClick(pkg.id);
                }}
                aria-label={`View details for package ${pkg.title}`}
              >
                {/* Image */}
                {pkg.images ? (
                  <img
                    src={
                      pkg.images.startsWith("http")
                        ? pkg.images
                        : `${API.defaults.baseURL}${pkg.images}`
                    }
                    alt={pkg.title}
                    className="w-full h-56 object-cover rounded-t-3xl"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-t-3xl select-none">
                    No Image Available
                  </div>
                )}

                {/* Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900 truncate mb-2">
                    {pkg.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {pkg.pickup_location} <span className="mx-1">→</span>{" "}
                    {pkg.drop_location}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-green-700 font-bold text-lg">
                        ₹{pkg.price_expectation.toLocaleString()}
                      </span>
                      <time
                        className="text-xs text-gray-400 mt-1"
                        dateTime={new Date(pkg.create_at).toISOString()}
                      >
                        {new Date(pkg.create_at).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full select-none">
                      {pkg.weight} kg
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full mt-12">
              No packages found matching your criteria.
            </p>
          )}
        </section>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav
            className="flex justify-center items-center mt-10 gap-2 select-none"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Previous page"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              const isCurrent = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`px-4 py-2 rounded-lg border transition ${
                    isCurrent
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Next page"
            >
              Next
            </button>
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
