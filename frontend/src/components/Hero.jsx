import React from 'react';
import '../index.css';

import { Link } from 'react-router-dom';
// import Tms1 from '../images/Tms1.jpg';
import Tms2 from '../images/Tms2.jpg';
import Tms3 from '../images/Tms3.jpg';
import Tms4 from '../images/Tms4.jpg';
// import Tms5 from '../images/Tms5.jpg';
// import Tms6 from '../images/Tms6.jpg';
import Tms7 from '../images/Tms7.jpg';
import {
  FaTruckMoving,
  FaChartLine,
  FaUserShield,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';

// FeatureCard Component
const FeatureCard = ({ image, title, description, icon }) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 h-[400px] flex flex-col">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6 flex-1 flex flex-col justify-between">
      <div>
        <div className="text-blue-700 mb-3">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

// HomePage Component
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar */}


      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-white">
        <img src={Tms7} alt="Futuristic Truck" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 text-center px-6 max-w-3xl animate-fade-in">
          <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">Drive Logistics Forward</h1>
          <p className="text-xl mb-8 text-gray-100">
            TruckBase TMS helps you manage fleets, optimize routes, and deliver smarter.
          </p>
          <Link
            to="/login"
            className="animated-btn bg-white text-blue-700"
          >
            🚀 Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">
        <FeatureCard
          image={Tms2}
          icon={<FaTruckMoving size={30} />}
          title="Fleet Management"
          description="Track trucks, drivers, and cargo in real-time with advanced analytics."
        />
        <FeatureCard
          image={Tms4}
          icon={<FaChartLine size={30} />}
          title="Route Optimization"
          description="Reduce fuel costs and delivery times with intelligent route planning."
        />
        <FeatureCard
          image={Tms3}
          icon={<FaUserShield size={30} />}
          title="Secure Access"
          description="Role-based access control for dispatchers, drivers, and admins."
        />
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to transform your trucking operations?</h2>
        <p className="mb-6 text-gray-600 text-lg">Join logistics leaders using TruckBase TMS.</p>
        <Link
          to="/register"
          className="animated-btn bg-blue-700 text-white"
        >
          Register Now
        </Link>
      </section>

     
      
    </div>
  );
};

export default HomePage;
