import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  FileText,
  User,
  Settings,
  CreditCard,
  Users,
  Sparkles,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Wallet, label: "Transactions", path: "/transactions" },
    { icon: FileText, label: "Budgets", path: "/budgets" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: CreditCard, label: "Accounts", path: "/accounts" },
    { icon: Users, label: "Splitwise", path: "/splitwise" },
  ];

  const bottomItems = [
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="relative w-[290px] min-h-screen overflow-hidden border-r border-white/10 bg-[#070816] flex flex-col justify-between">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-120px] left-[-100px] w-[260px] h-[260px] bg-violet-500/20 blur-[120px] rounded-full" />

        <div className="absolute bottom-[-120px] right-[-120px] w-[260px] h-[260px] bg-cyan-500/10 blur-[120px] rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />

      </div>

      {/* CONTENT */}
      <div className="relative z-10">

        {/* LOGO */}
        <div className="px-7 pt-8 pb-10">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.45)]">
              <Sparkles className="text-white" size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-200 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                FinTrack
              </h1>

              <p className="text-xs text-gray-500 tracking-wide">
                NEXT GEN FINANCE
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="px-4 space-y-3">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <motion.button
                key={item.label}
                whileHover={{
                  x: 5,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => navigate(item.path)}
                className={`
                  relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl
                  transition-all duration-300 group overflow-hidden
                  ${
                    active
                      ? "bg-white/10 border border-white/10 shadow-[0_0_35px_rgba(139,92,246,0.18)]"
                      : "hover:bg-white/[0.04]"
                  }
                `}
              >

                {/* ACTIVE GLOW */}
                {active && (
                  <>
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 to-cyan-500/10"
                    />

                    <div className="absolute left-0 top-3 bottom-3 w-[4px] rounded-full bg-gradient-to-b from-violet-400 to-cyan-300" />
                  </>
                )}

                {/* ICON */}
                <div
                  className={`
                    relative z-10 w-11 h-11 rounded-xl flex items-center justify-center
                    transition-all duration-300
                    ${
                      active
                        ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg"
                        : "bg-white/[0.03] text-gray-400 group-hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} />
                </div>

                {/* LABEL */}
                <div className="relative z-10 text-left">
                  <p
                    className={`font-semibold tracking-wide ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </p>

                  {active && (
                    <p className="text-[11px] text-violet-300 mt-[2px]">
                      Active workspace
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="relative z-10 px-4 pb-6 space-y-3">

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />

        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <motion.button
              whileHover={{
                x: 4,
              }}
              whileTap={{
                scale: 0.98,
              }}
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-4 px-5 py-4 rounded-2xl
                transition-all duration-300
                ${
                  active
                    ? "bg-white/10 border border-white/10"
                    : "hover:bg-white/[0.04]"
                }
              `}
            >
              <div
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center
                  ${
                    active
                      ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white"
                      : "bg-white/[0.03] text-gray-400"
                  }
                `}
              >
                <Icon size={20} />
              </div>

              <span
                className={`font-medium ${
                  active ? "text-white" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}











// import {
//   LayoutDashboard,
//   Wallet,
//   BarChart3,
//   FileText,
//   User,
//   Settings,
//   CreditCard,
//   Bot,
//   Users,
// } from "lucide-react";

// import { useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
//     { icon: Wallet, label: "Transactions", path: "/transactions" },
//     { icon: FileText, label: "Budgets", path: "/budgets" },
//     { icon: BarChart3, label: "Analytics", path: "/analytics" },
//     { icon: FileText, label: "Documents", path: "/documents" },
//     { icon: CreditCard, label: "Accounts", path: "/accounts" },
//     { icon: Users, label: "Splitwise", path: "/splitwise" },
//     { icon: Bot, label: "Finance AI", path: "/ai" },
//   ];

//   const bottomItems = [
//     { icon: User, label: "Profile", path: "/profile" },
//     { icon: Settings, label: "Settings", path: "/settings" },
//   ];

//   return (
//     <div className="w-72 min-h-screen border-r border-white/10 bg-white/5 backdrop-blur-2xl flex flex-col justify-between px-4 py-6">

//       <div>

//         <div className="px-4 mb-10">
//           <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-300 via-violet-400 to-blue-400 bg-clip-text text-transparent">
//             FinTrack
//           </h1>

//           <p className="text-gray-400 text-sm mt-1">
//             Smart Finance Platform
//           </p>
//         </div>

//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const active = location.pathname === item.path;

//             return (
//               <motion.button
//                 whileHover={{ x: 4 }}
//                 whileTap={{ scale: 0.98 }}
//                 key={item.label}
//                 onClick={() => navigate(item.path)}
//                 className={`
//                   w-full flex items-center gap-4 px-4 py-3 rounded-2xl
//                   transition-all duration-300 relative overflow-hidden
//                   ${
//                     active
//                       ? "bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-400/20"
//                       : "hover:bg-white/5"
//                   }
//                 `}
//               >
//                 {active && (
//                   <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-400 to-blue-400 rounded-full" />
//                 )}

//                 <Icon
//                   size={20}
//                   className={active ? "text-violet-300" : "text-gray-400"}
//                 />

//                 <span
//                   className={`font-medium ${
//                     active ? "text-white" : "text-gray-400"
//                   }`}
//                 >
//                   {item.label}
//                 </span>
//               </motion.button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="space-y-2">
//         {bottomItems.map((item) => {
//           const Icon = item.icon;
//           const active = location.pathname === item.path;

//           return (
//             <button
//               key={item.label}
//               onClick={() => navigate(item.path)}
//               className={`
//                 w-full flex items-center gap-4 px-4 py-3 rounded-2xl
//                 transition-all duration-300
//                 ${active ? "bg-white/10" : "hover:bg-white/5"}
//               `}
//             >
//               <Icon
//                 size={20}
//                 className={active ? "text-white" : "text-gray-400"}
//               />

//               <span
//                 className={`font-medium ${
//                   active ? "text-white" : "text-gray-400"
//                 }`}
//               >
//                 {item.label}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
// import {
//   LayoutDashboard,
//   Wallet,
//   BarChart3,
//   FileText,
//   User,
//   Settings,
//   CreditCard,
//   Bot,
//   Users,
// } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
//     { icon: <Wallet size={18} />, label: "Transactions", path: "/transactions" },
//     { icon: <FileText size={18} />, label: "Budgets", path: "/budgets" },
//     { icon: <BarChart3 size={18} />, label: "Analytics", path: "/analytics" },
//     { icon: <FileText size={18} />, label: "Documents", path: "/documents" },
//     { icon: <CreditCard size={18} />, label: "Accounts", path: "/accounts" },
//     { icon: <Users size={18} />, label: "Splitwise", path: "/splitwise" },
//     { icon: <Bot size={18} />, label: "Finance AI", path: "/ai" },
//   ];

//   const bottomItems = [
//     { icon: <User size={18} />, label: "Profile", path: "/profile" },
//     { icon: <Settings size={18} />, label: "Settings", path: "/settings" },
//   ];

//   return (
//     <div
//       className="min-h-screen w-64 flex flex-col justify-between text-white backdrop-blur-sm"
//       style={{
//         background: `
//           radial-gradient(circle at top left, rgba(80,0,150,0.18), transparent 70%),
//           radial-gradient(circle at bottom right, rgba(0,80,200,0.15), transparent 70%),
//           #070710
//         `,
//         borderRight: "1px solid rgba(255,255,255,0.05)",
//         boxShadow: "4px 0px 20px rgba(0,0,0,0.7)"
//       }}
//     >
//       <div>
//         <div
//           className="p-6 text-2xl font-extrabold tracking-wider bg-clip-text text-transparent"
//           style={{
//             backgroundImage: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
//             filter: "brightness(0.9)"
//           }}
//         >
//           FinTrack
//         </div>

//         <nav className="mt-4 space-y-1">
//           {menuItems.map((item) => (
//             <SidebarItem
//               key={item.label}
//               icon={item.icon}
//               label={item.label}
//               active={location.pathname === item.path}
//               onClick={() => navigate(item.path)}
//             />
//           ))}
//         </nav>
//       </div>

//       <div className="p-4 border-t border-white/5">
//         {bottomItems.map((item) => (
//           <SidebarItem
//             key={item.label}
//             icon={item.icon}
//             label={item.label}
//             active={location.pathname === item.path}
//             onClick={() => navigate(item.path)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function SidebarItem({ icon, label, active, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       className={`
//         flex items-center gap-3 px-6 py-3 cursor-pointer rounded-lg 
//         transition-all duration-200
//         ${active ? "bg-white/5 shadow-md shadow-black/50" : "hover:bg-white/3"}
//       `}
//     >
//       <div className={`${active ? "text-purple-300" : "text-gray-400"}`}>
//         {icon}
//       </div>
//       <span className={`text-sm font-medium ${active ? "text-white" : "text-gray-400"}`}>
//         {label}
//       </span>
//     </div>
//   );
// }

