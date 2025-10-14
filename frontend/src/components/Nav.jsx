import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaInfoCircle, 
  FaStore, 
  FaNewspaper, 
  FaTimes, 
  FaBars,
  FaUser,
  FaUserPlus
} from 'react-icons/fa';

const Nav = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setNavOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {navOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setNavOpen(false)}
        />
      )}
      
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white shadow-md py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo with 3D effect */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-blue-700 flex items-center gap-2 group"
          >
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              TruckBase TMS
            </span>
            <span className="block w-2 h-2 rounded-full bg-blue-600 transform transition-transform duration-300 group-hover:scale-150"></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: "/", icon: <FaHome />, label: "Home" },
              { to: "/features", icon: <FaInfoCircle />, label: "About Us" },
              { to: "/marketplace", icon: <FaStore />, label: "Marketplace" },
              { to: "/news", icon: <FaNewspaper />, label: "News" }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                  location.pathname === item.to
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <span className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="relative">
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-4 py-2 border border-blue-700 text-blue-700 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 group"
            >
              <FaUser className="text-blue-600" />
              <span>Login</span>
            </Link>
            <Link 
              to="/register" 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-medium transition-all duration-300 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <FaUserPlus />
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-blue-700 bg-blue-50 border border-blue-200 transition-all duration-300 hover:bg-blue-100"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
          >
            {navOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            navOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link 
                to="/" 
                className="text-xl font-bold text-blue-700"
                onClick={() => setNavOpen(false)}
              >
                TruckBase TMS
              </Link>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full text-blue-700 hover:bg-blue-50"
                onClick={() => setNavOpen(false)}
                aria-label="Close navigation"
              >
                <FaTimes />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {[
                { to: "/", icon: <FaHome />, label: "Home" },
                { to: "/features", icon: <FaInfoCircle />, label: "About Us" },
                { to: "/marketplace", icon: <FaStore />, label: "Marketplace" },
                { to: "/news", icon: <FaNewspaper />, label: "News" }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-6 py-3 font-medium transition-all duration-300 ${
                    location.pathname === item.to
                      ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                  onClick={() => setNavOpen(false)}
                >
                  <span className="text-blue-600">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="p-4 border-t space-y-3">
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-blue-700 text-blue-700 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50"
                onClick={() => setNavOpen(false)}
              >
                <FaUser />
                <span>Login</span>
              </Link>
              <Link 
                to="/register" 
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-medium transition-all duration-300 hover:from-blue-700 hover:to-blue-900"
                onClick={() => setNavOpen(false)}
              >
                <FaUserPlus />
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;