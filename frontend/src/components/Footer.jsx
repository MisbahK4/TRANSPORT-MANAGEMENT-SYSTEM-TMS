import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaTruck,
  FaPaperPlane,
  FaArrowRight
} from "react-icons/fa";

const Footer = () => (
  <footer
    className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-12 pb-8 sm:pt-16 sm:pb-12 border-t border-gray-800 overflow-hidden"
    aria-label="Footer"
  >
    {/* Decorative background elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"></div>
    </div>

    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

        {/* Brand & Contact */}
        <div className="md:col-span-1">
          <div className="mb-6">
            <h4 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-white group">
              <FaTruck className="text-blue-500 transform transition-transform duration-500 group-hover:rotate-12" aria-hidden="true" /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">TruckBase TMS</span>
            </h4>
            <p className="mb-6 text-gray-400 leading-relaxed">
              Smart solutions for fleet and logistics management.<br />
              Streamline operations with real-time insights.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="mt-1 p-2 bg-blue-500/10 rounded-lg">
                <FaEnvelope className="text-blue-400" aria-label="Email" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email Us</p>
                <a
                  href="mailto:support@truckbase.com"
                  className="text-sm font-medium hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  support@truckbase.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="mt-1 p-2 bg-blue-500/10 rounded-lg">
                <FaPhoneAlt className="text-blue-400" aria-label="Phone" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Call Us</p>
                <a
                  href="tel:+919876543210"
                  className="text-sm font-medium hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4 text-white relative inline-block">
              Features
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/features", label: "Features" },
                { to: "/marketplace", label: "Marketplace" },
                { to: "/news", label: "News" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300 group"
                  >
                    <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaArrowRight size={10} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-white relative inline-block">
              Legal
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300 group"
                  >
                    <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaArrowRight size={10} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="md:col-span-1">
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4 text-white relative inline-block">
              Stay Connected
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500"></span>
            </h4>
            <form
              className="relative"
              aria-label="Newsletter Signup"
              autoComplete="off"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-full px-5 py-3 bg-gray-800/70 backdrop-blur-sm border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-sm focus:outline-none transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Subscribe"
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-white relative inline-block">
              Follow Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500"></span>
            </h4>
            <div className="flex space-x-4">
              {[
                { href: "https://facebook.com", icon: <FaFacebookF />, color: "hover:bg-blue-600" },
                { href: "https://twitter.com", icon: <FaTwitter />, color: "hover:bg-sky-500" },
                { href: "https://linkedin.com", icon: <FaLinkedinIn />, color: "hover:bg-blue-500" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Social media link ${index + 1}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/70 backdrop-blur-sm border border-gray-700 text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
                >
                  <span className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></span>
                  <span className="relative z-10">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Note */}
      {/* <div className="mt-12 p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 text-center text-sm text-gray-400">
        If you have a disability and are having trouble accessing information or need materials in an alternate format, email
        <a
          href="mailto:support@truckbase.com"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-1"
        >
          support@truckbase.com
        </a>{" "}
        for assistance.
      </div> */}
    </div>

    {/* Bottom Note */}
    <div className="relative z-10 mt-8 pt-6 border-t border-gray-800/50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-gray-300">TruckBase TMS</span>. Created by Mohd Misbah Khan.
      </div>
    </div>
  </footer>
);

export default Footer;