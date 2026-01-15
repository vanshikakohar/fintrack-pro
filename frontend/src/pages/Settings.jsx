import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { User, Settings, Bell, Moon, Globe, Trash2, LogOut } from "lucide-react";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("English");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="text-blue-600" /> Settings
        </h1>
        <p className="text-gray-500 -mt-2">Manage your account, preferences and notifications</p>

        {/* --- Profile Section --- */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="text-blue-600" /> Profile Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-3 rounded-lg" placeholder="Full Name" />
            <input className="border p-3 rounded-lg" placeholder="Email" />
            <input className="border p-3 rounded-lg" placeholder="Phone Number" />
            <input className="border p-3 rounded-lg" placeholder="Change Password" type="password" />
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-fit">
            Save Changes
          </button>
        </div>

        {/* --- Preferences Section --- */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Moon className="text-blue-600" /> App Preferences
          </h2>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Dark Mode</span>
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={() => setDarkMode(!darkMode)}
              className="w-5 h-5"
            />
          </div>

          {/* Currency Selector */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Currency</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="INR">INR ₹</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Language</span>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* --- Notification Settings --- */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="text-blue-600" /> Notification Settings
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Email Alerts</span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">SMS Alerts</span>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={() => setSmsAlerts(!smsAlerts)}
              className="w-5 h-5"
            />
          </div>
        </div>

        {/* --- Danger Zone --- */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <Trash2 /> Danger Zone
          </h2>

          <button className="bg-red-600 text-white px-4 py-2 rounded-lg w-fit flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>

          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg w-fit flex items-center gap-2 mt-3">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
