import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  FileText,
  User,
  Settings,
  CreditCard,
  Bot,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Wallet size={18} />, label: "Transactions", path: "/transactions" },
    { icon: <FileText size={18} />, label: "Budgets", path: "/budgets" },
    { icon: <BarChart3 size={18} />, label: "Analytics", path: "/analytics" },
    { icon: <FileText size={18} />, label: "Documents", path: "/documents" },
    { icon: <CreditCard size={18} />, label: "Accounts", path: "/accounts" },
    { icon: <Users size={18} />, label: "Splitwise", path: "/splitwise" },
    { icon: <Bot size={18} />, label: "Finance AI", path: "/ai" },
  ];

  const bottomItems = [
    { icon: <User size={18} />, label: "Profile", path: "/profile" },
    { icon: <Settings size={18} />, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className="min-h-screen w-64 flex flex-col justify-between text-white backdrop-blur-sm"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(80,0,150,0.18), transparent 70%),
          radial-gradient(circle at bottom right, rgba(0,80,200,0.15), transparent 70%),
          #070710
        `,
        borderRight: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "4px 0px 20px rgba(0,0,0,0.7)"
      }}
    >
      <div>
        <div
          className="p-6 text-2xl font-extrabold tracking-wider bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
            filter: "brightness(0.9)"
          }}
        >
          FinTrack
        </div>

        <nav className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-6 py-3 cursor-pointer rounded-lg 
        transition-all duration-200
        ${active ? "bg-white/5 shadow-md shadow-black/50" : "hover:bg-white/3"}
      `}
    >
      <div className={`${active ? "text-purple-300" : "text-gray-400"}`}>
        {icon}
      </div>
      <span className={`text-sm font-medium ${active ? "text-white" : "text-gray-400"}`}>
        {label}
      </span>
    </div>
  );
}

