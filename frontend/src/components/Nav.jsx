import React from 'react'
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
      <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-700">TruckBase TMS</Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-700 font-medium transition">Home</Link>
            <Link to="/features" className="text-gray-700 hover:text-blue-700 font-medium transition">About Us</Link>
            <Link to="/marketplace" className="text-gray-700 hover:text-blue-700 font-medium transition">Marketplace</Link>
            <Link to="/news" className="text-gray-700 hover:text-blue-700 font-medium transition">News</Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="animated-btn border border-blue-700 text-blue-700">Login</Link>
            <Link to="/register" className="animated-btn bg-blue-700 text-white">Register</Link>
          </div>
        </div>
      </nav>

  )
}

export default Nav
