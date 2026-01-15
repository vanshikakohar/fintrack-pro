import { Search } from "lucide-react";

export default function Topbar() {
  return (
    <div
      className="flex justify-between items-center px-10 py-4 backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(180deg, rgba(20,15,45,0.55), rgba(10,10,25,0.7))",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      {/* Search */}
      <div
        className="flex items-center rounded-xl px-4 py-2"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)"
        }}
      >
        <Search size={18} className="text-gray-300" />
        <input
          type="text"
          placeholder="Search transactions..."
          className="bg-transparent outline-none text-sm text-gray-200 ml-2 w-80"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-300 font-medium">Welcome back 👋</span>

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
          style={{
            background:
              "linear-gradient(90deg,#7c3aed,#60a5fa)",
            color: "white"
          }}
        >
          {localStorage.getItem("userName")?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </div>
  );
}

