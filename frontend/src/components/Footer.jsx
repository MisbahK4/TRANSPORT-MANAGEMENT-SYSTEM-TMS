import React from 'react'
import { Link } from 'react-router-dom';
import {

  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';


const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">TruckBase TMS</h4>
            <p>Smart solutions for fleet and logistics management.</p>
            <p className="mt-2">Email: support@truckbase.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:underline">Features</Link></li>
              <li><Link to="/marketplace" className="hover:underline">Marketplace</Link></li>
              <li><Link to="/news" className="hover:underline">News</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4 text-xl">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TruckBase TMS. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Footer
