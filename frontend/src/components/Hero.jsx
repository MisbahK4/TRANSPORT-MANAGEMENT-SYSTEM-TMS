import React, { memo } from 'react';
import '../index.css';
import { Link } from 'react-router-dom';

import Tms2 from '../images/Tms2.jpg';
import Tms3 from '../images/Tms3.jpg';
import Tms4 from '../images/Tms4.jpg';
import Tms7 from '../images/Tms7.jpg';

import {
  FaTruckMoving,
  FaChartLine,
  FaUserShield,
  FaRocket,
} from 'react-icons/fa';

// FeatureCard Component with memoization
const FeatureCard = memo(({ image, title, description, icon }) => (
  <div className="group relative [perspective:1000px]">
    <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(-10deg)_rotateX(10deg)_translateZ(20px)] group-hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
      <img 
        src={image} 
        alt={title} 
        className="w-full h-44 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy"
      />
      <div className="p-6 relative z-20">
        <div className="text-blue-700 mb-3 transform transition-transform duration-500 group-hover:translate-y-1">{icon}</div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800 transform transition-transform duration-500 group-hover:translate-x-1">{title}</h3>
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  </div>
));

// HomePage Component
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 font-sans overflow-x-hidden">

      {/* Hero Section with 3D Parallax Effect */}
      <section className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <img
            src={Tms7}
            alt="Futuristic Truck"
            className="w-full h-full object-cover transform scale-110 [transform:translateZ(-1px)_scale(1.5)]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent backdrop-blur-sm"></div>
        </div>

        {/* Floating 3D Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl animate-fade-in">
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-6 leading-tight transform transition-transform duration-700 hover:[transform:rotateX(5deg)_rotateY(-5deg)]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Drive Logistics Forward
              </span>
            </h1>
            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl opacity-70 -z-10"></div>
          </div>
          
          <p className="text-base sm:text-lg mb-8 text-gray-200 max-w-2xl mx-auto transform transition-transform duration-500 hover:[transform:translateZ(10px)]">
            TruckBase TMS helps you manage fleets, optimize routes, and deliver smarter.
          </p>
          
          <Link
            to="/login"
            className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800
              hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-10 py-4 rounded-full
              shadow-lg transform transition-all duration-500 hover:scale-110 hover:shadow-2xl
              focus:outline-none focus:ring-4 focus:ring-blue-400 group"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></span>
            <FaRocket className="relative z-10 transform transition-transform duration-500 group-hover:rotate-12" size={22} />
            <span className="relative z-10">Get Started</span>
          </Link>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      </section>

      {/* Features Section with 3D Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          image={Tms2}
          icon={<FaTruckMoving size={28} />}
          title="Fleet Management"
          description="Track trucks, drivers, and cargo in real-time with advanced analytics."
        />
        <FeatureCard
          image={Tms4}
          icon={<FaChartLine size={28} />}
          title="Route Optimization"
          description="Reduce fuel costs and delivery times with intelligent route planning."
        />
        <FeatureCard
          image={Tms3}
          icon={<FaUserShield size={28} />}
          title="Secure Access"
          description="Role-based access control for dispatchers, drivers, and admins."
        />
      </section>

      {/* CTA Section with 3D Effect - Fixed Background Issue */}
      <section className="relative py-20 text-center bg-gradient-to-r from-blue-600 to-purple-700">
        {/* Diagonal cut at bottom using pseudo-element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-600 to-purple-700 [clip-path:polygon(0_50%,100%_0,100%_100%,0_100%)]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-bold mb-6 text-white transform transition-transform duration-500 hover:[transform:translateZ(20px)]">
            Ready to transform your trucking operations?
          </h2>
          <p className="mb-10 text-base sm:text-lg text-gray-200 max-w-xl mx-auto transform transition-transform duration-500 hover:[transform:translateZ(10px)]">
            Join logistics leaders using TruckBase TMS.
          </p>
          <Link
            to="/register"
            className="relative inline-block bg-white text-blue-700 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-md 
              transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:[transform:rotateY(-5deg)_rotateX(5deg)]
              focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
