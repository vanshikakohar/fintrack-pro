import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import { motion } from "framer-motion";

export default function Topbar() {
  const userName =
    localStorage.getItem("userName") || "Vanshika";

  return (
    <header className="sticky top-0 z-50">

      {/* GLASS NAVBAR */}
      <div className="relative overflow-hidden border-b border-white/10 backdrop-blur-2xl bg-[#050816]/70">

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute top-[-120px] left-[20%] w-[280px] h-[280px] bg-violet-500/10 blur-[120px] rounded-full" />

          <div className="absolute right-[-100px] top-[-60px] w-[220px] h-[220px] bg-cyan-500/10 blur-[120px] rounded-full" />

        </div>

        {/* CONTENT */}
        <div className="relative z-10 px-8 py-5 flex items-center justify-between">

          {/* SEARCH */}
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative"
          >

            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search transactions, budgets, analytics..."
              className="
                w-[420px]
                bg-white/[0.04]
                border border-white/10
                rounded-2xl
                py-3.5 pl-12 pr-5
                text-sm
                text-white
                placeholder:text-gray-500
                outline-none
                transition-all duration-300
                focus:border-violet-400/40
                focus:bg-white/[0.07]
                focus:shadow-[0_0_30px_rgba(139,92,246,0.15)]
              "
            />

          </motion.div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-5">

            {/* AI STATUS */}
            <motion.div
              whileHover={{ y: -2 }}
              className="
                hidden md:flex items-center gap-2
                px-4 py-2 rounded-2xl
                bg-gradient-to-r from-violet-500/10 to-cyan-500/10
                border border-white/10
              "
            >
              <Sparkles size={16} className="text-violet-300" />

              <span className="text-sm text-gray-200 font-medium">
                FinTrack Pro
              </span>
            </motion.div>

            {/* NOTIFICATIONS */}
            <motion.button
              whileHover={{
                scale: 1.05,
                rotate: 4,
              }}
              whileTap={{ scale: 0.95 }}
              className="
                relative w-12 h-12 rounded-2xl
                bg-white/[0.05]
                border border-white/10
                flex items-center justify-center
                hover:bg-white/[0.08]
                transition-all
              "
            >

              <Bell size={19} className="text-gray-300" />

              {/* NOTIFICATION DOT */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,1)]" />

            </motion.button>

            {/* PROFILE */}
            <motion.div
              whileHover={{ y: -2 }}
              className="
                flex items-center gap-3
                pl-3 pr-4 py-2
                rounded-2xl
                border border-white/10
                bg-white/[0.04]
                cursor-pointer
              "
            >

              {/* AVATAR */}
              <div className="relative">

                <div
                  className="
                    w-12 h-12 rounded-2xl
                    bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500
                    flex items-center justify-center
                    font-bold text-white
                    shadow-[0_0_25px_rgba(139,92,246,0.35)]
                  "
                >
                  {userName[0]?.toUpperCase()}
                </div>

                {/* ONLINE DOT */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#050816] rounded-full" />

              </div>

              {/* USER INFO */}
              <div className="hidden sm:block">

                <p className="text-xs text-gray-500">
                  Welcome back
                </p>

                <h4 className="font-semibold text-white leading-tight">
                  {userName}
                </h4>
              </div>

              <ChevronDown
                size={16}
                className="text-gray-500"
              />

            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
// import { Search, Bell } from "lucide-react";

// export default function Topbar() {
//   return (
//     <div className="sticky top-0 z-40 backdrop-blur-2xl border-b border-white/10 bg-black/10">

//       <div className="px-8 py-5 flex items-center justify-between">

//         <div className="relative">

//           <Search
//             size={18}
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//           />

//           <input
//             type="text"
//             placeholder="Search transactions..."
//             className="
//               w-[360px]
//               bg-white/5
//               border border-white/10
//               rounded-2xl
//               py-3 pl-11 pr-4
//               text-sm
//               text-white
//               placeholder:text-gray-500
//               outline-none
//               focus:border-violet-400/40
//               focus:bg-white/10
//               transition-all
//             "
//           />
//         </div>

//         <div className="flex items-center gap-5">

//           <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
//             <Bell size={18} className="text-gray-300" />
//           </button>

//           <div className="flex items-center gap-3">

//             <div className="text-right">
//               <p className="text-sm text-gray-400">
//                 Welcome back
//               </p>

//               <h4 className="font-semibold text-white">
//                 Vanshika 👋
//               </h4>
//             </div>

//             <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20">
//               V
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
