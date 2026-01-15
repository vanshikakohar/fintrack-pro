import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-4 bg-blue-900 text-white shadow-md">
        <div className="flex items-center space-x-2 text-2xl font-bold">
          <div className="bg-blue-700 px-3 py-1 rounded-lg">F</div>
          <span>FinTrack</span>
        </div>
        <div className="flex space-x-8 text-sm font-medium">
          <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
          <Link to="/transactions" className="hover:text-blue-300">Transactions</Link>
          <Link to="/budgets" className="hover:text-blue-300">Budgets</Link>
          <Link to="/analytics" className="hover:text-blue-300">Reports</Link>
          <Link to="/ai" className="hover:text-blue-300">Finance AI</Link>
          <Link to="/about" className="hover:text-blue-300">About</Link>
          <Link to="/contact" className="hover:text-blue-300">Contact</Link>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/login"
            className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-900 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-400 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-12 py-24 bg-blue-900 text-white">
        <div className="max-w-xl">
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Smart Finance Management with <span className="text-blue-300">FinTrack</span>
          </motion.h1>
          <p className="text-lg mb-8 text-blue-100">
            Your AI-powered personal finance assistant designed for Indian users
            to track expenses, manage budgets, and gain valuable insights with
            support for all major Indian banks.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/register"
              className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-400 transition"
            >
              Get Started Free →
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            Join <b>10,000+</b> Indian users managing their finances
          </p>
        </div>
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/2331/2331957.png"
          alt="Finance Illustration"
          className="w-96 mt-12 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
      </section>

      {/* Features Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-12 py-24 bg-blue-50">
        <div className="max-w-xl">
          <h4 className="text-green-600 font-semibold mb-2">Just Released</h4>
          <h2 className="text-3xl font-bold mb-4">New Features Available!</h2>
          <p className="text-gray-700 mb-6">
            We’ve just added powerful new features to help you better manage your finances and gain deeper insights:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Statement upload with automatic parsing for HDFC, ICICI, SBI, Zerodha, and more</li>
            <li>UPI transaction tracking for PhonePe, Google Pay, and BHIM</li>
            <li>Interactive spending analytics and visualizations</li>
            <li>Intelligent budget tracking with predictive alerts</li>
          </ul>
          <Link
            to="/features"
            className="inline-block mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Explore New Features →
          </Link>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4213/4213179.png"
          alt="Features Illustration"
          className="w-80 mt-10 lg:mt-0"
        />
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-10 px-12 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">FinTrack</h3>
            <p className="text-blue-200 text-sm">
              Your AI-powered personal finance assistant for better financial management.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="space-y-1 text-blue-200 text-sm">
              <li>Dashboard</li>
              <li>Transactions</li>
              <li>Budgets</li>
              <li>Reports</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1 text-blue-200 text-sm">
              <li>Help Center</li>
              <li>Documentation</li>
              <li>API Status</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-blue-300 text-sm mt-10">
          © {new Date().getFullYear()} FinTrack. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;




// import React from "react";
// import Navbar from "../components/Navbar";
// import { Link } from "react-router-dom";

// export default function Landing() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-purple-200 flex flex-col">
//       <Navbar />

//       <main className="flex flex-col md:flex-row justify-between items-center flex-1 px-10 md:px-20 py-10 bg-[#0B3B91] text-white rounded-t-3xl shadow-lg">
//         {/* Left Section */}
//         <div className="max-w-lg">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
//             Smart Finance Management with <span className="text-blue-300">FinTrack</span>
//           </h1>
//           <p className="text-gray-200 mb-6 text-lg">
//             Your AI-powered personal finance assistant designed for Indian users to track expenses, manage budgets, and gain valuable insights — with support for all major Indian banks.
//           </p>

//           <div className="flex items-center gap-3">
//             <Link
//               to="/dashboard"
//               className="bg-blue-400 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-300 transition"
//             >
//               Get Started Free →
//             </Link>
//             <div className="flex -space-x-3">
//               <img src="https://i.pravatar.cc/40?img=1" className="w-8 h-8 rounded-full border-2 border-blue-900" />
//               <img src="https://i.pravatar.cc/40?img=2" className="w-8 h-8 rounded-full border-2 border-blue-900" />
//               <img src="https://i.pravatar.cc/40?img=3" className="w-8 h-8 rounded-full border-2 border-blue-900" />
//             </div>
//             <span className="text-sm text-gray-200">
//               Join 10,000+ Indian users
//             </span>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="hidden md:block bg-white rounded-3xl shadow-lg w-[400px] h-[260px]"></div>
//       </main>
//     </div>
//   );
// }
