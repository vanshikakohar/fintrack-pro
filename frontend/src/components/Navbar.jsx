import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-[#0B3B91] text-white">
      <div className="flex items-center gap-2">
        <div className="bg-white text-blue-700 font-bold text-lg px-2 py-1 rounded">
          F
        </div>
        <span className="font-semibold text-xl">FinTrack</span>
      </div>

      <ul className="hidden md:flex gap-6 text-sm">
        <li><Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link></li>
        <li><Link to="/transactions" className="hover:text-blue-200">Transactions</Link></li>
        <li><Link to="/budgets" className="hover:text-blue-200">Budgets</Link></li>
        <li><Link to="/reports" className="hover:text-blue-200">Reports</Link></li>
        <li><Link to="/finance-ai" className="hover:text-blue-200">Finance AI</Link></li>
        <li><Link to="/about" className="hover:text-blue-200">About</Link></li>
        <li><Link to="/contact" className="hover:text-blue-200">Contact</Link></li>
      </ul>

      <div className="flex gap-3">
        <Link to="/login" className="border border-white px-4 py-1 rounded hover:bg-white hover:text-blue-700">
          Log In
        </Link>
        <Link to="/signup" className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-blue-200">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
