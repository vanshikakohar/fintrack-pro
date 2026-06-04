import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import API from "../utils/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { Toaster, toast } from "react-hot-toast";

import {
  Plus,
  MoreHorizontal,
  ShoppingBag,
  Car,
  Utensils,
  HeartPulse,
  GraduationCap,
  Wallet,
  Tv,
  Zap,
} from "lucide-react";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    month: "",
    category: "",
    limit: "",
  });

  const shownExceedAlerts = useRef(new Set());

  /* ================= FETCH ================= */

  const fetchBudgets = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) return;

    try {
      const res = await axios.get(
        `${API}/budgets?userId=${user._id}`
      );

      const safeBudgets = Array.isArray(res.data)
        ? res.data.map((b) => ({
            ...b,
            spent: Number(b.spent || 0),
            limit: Number(b.limit || 0),
          }))
        : [];

      setBudgets(safeBudgets);

      safeBudgets.forEach((b) => {
        if (
          b.spent > b.limit &&
          !shownExceedAlerts.current.has(b._id)
        ) {
          toast.error(`Budget exceeded in ${b.category}`);

          shownExceedAlerts.current.add(b._id);
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load budgets");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  /* ================= ADD ================= */

  const addBudget = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) {
      toast.error("Please login");
      return;
    }

    try {
      await axios.post(`${API}/budgets/add`, {
        ...form,
        limit: Number(form.limit),
        userId: user._id,
      });

      toast.success("Budget added");

      setForm({
        month: "",
        category: "",
        limit: "",
      });

      setShowForm(false);

      fetchBudgets();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add budget");
    }
  };

  /* ================= DELETE ================= */

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`${API}/budgets/${id}`);

      toast.success("Budget deleted");

      fetchBudgets();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {
    const totalLimit = budgets.reduce(
      (acc, item) => acc + item.limit,
      0
    );

    const totalSpent = budgets.reduce(
      (acc, item) => acc + item.spent,
      0
    );

    const percentage =
      totalLimit > 0
        ? Math.round((totalSpent / totalLimit) * 100)
        : 0;

    return {
      totalBudgets: budgets.length,
      totalLimit,
      totalSpent,
      remaining: totalLimit - totalSpent,
      percentage,
    };
  }, [budgets]);

  /* ================= ICONS ================= */

  const categoryIcon = (category) => {
    const c = category?.toLowerCase();

    if (c?.includes("food"))
      return <Utensils size={18} />;

    if (c?.includes("shopping"))
      return <ShoppingBag size={18} />;

    if (c?.includes("car") || c?.includes("transport"))
      return <Car size={18} />;

    if (c?.includes("health"))
      return <HeartPulse size={18} />;

    if (c?.includes("education"))
      return <GraduationCap size={18} />;

    if (c?.includes("entertainment"))
      return <Tv size={18} />;

    if (c?.includes("bill"))
      return <Zap size={18} />;

    return <Wallet size={18} />;
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">

      {/* SIDEBAR */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        <Topbar />

        <Toaster position="top-right" />

        <main className="p-5 lg:p-8">

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-violet-300 via-violet-500 to-blue-400 bg-clip-text text-transparent">
                Budgets
              </h1>

              <p className="text-gray-400 mt-2 text-lg">
                Track your limits, manage spending and achieve your goals.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="
                px-7 py-4 rounded-2xl
                bg-gradient-to-r from-violet-600 to-blue-500
                font-semibold
                shadow-[0_0_35px_rgba(139,92,246,0.45)]
                hover:scale-105 transition-all
              "
            >
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Add Budget
              </div>
            </button>

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
              <p className="text-gray-400 text-sm mb-3">
                Total Budget
              </p>

              <h2 className="text-4xl font-bold">
                ₹{summary.totalLimit}
              </h2>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
              <p className="text-gray-400 text-sm mb-3">
                Total Spent
              </p>

              <h2 className="text-4xl font-bold text-pink-400">
                ₹{summary.totalSpent}
              </h2>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
              <p className="text-gray-400 text-sm mb-3">
                Remaining
              </p>

              <h2 className="text-4xl font-bold text-emerald-400">
                ₹{summary.remaining}
              </h2>
            </div>

          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

            {/* LEFT */}
            <div>

              {/* TITLE */}
              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-2xl font-bold">
                    Your Budget Goals
                  </h2>

                  <p className="text-gray-400 mt-1">
                    Track category wise spending
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-violet-600 text-sm">
                    Grid
                  </button>

                  <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                    List
                  </button>
                </div>

              </div>

              {/* CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {budgets.map((budget) => {

                  const percent =
                    budget.limit > 0
                      ? Math.round(
                          (budget.spent / budget.limit) * 100
                        )
                      : 0;

                  const exceeded = percent >= 100;

                  const styles = {
                    food: {
                      icon: "bg-emerald-500",
                      bar: "bg-emerald-400",
                      text: "text-emerald-400",
                    },

                    shopping: {
                      icon: "bg-violet-500",
                      bar: "bg-violet-400",
                      text: "text-violet-400",
                    },

                    entertainment: {
                      icon: "bg-yellow-500",
                      bar: "bg-yellow-400",
                      text: "text-yellow-400",
                    },

                    transport: {
                      icon: "bg-blue-500",
                      bar: "bg-blue-400",
                      text: "text-blue-400",
                    },

                    health: {
                      icon: "bg-pink-500",
                      bar: "bg-pink-400",
                      text: "text-pink-400",
                    },

                    education: {
                      icon: "bg-orange-500",
                      bar: "bg-orange-400",
                      text: "text-orange-400",
                    },

                    bills: {
                      icon: "bg-cyan-500",
                      bar: "bg-cyan-400",
                      text: "text-cyan-400",
                    },
                  };

                  let style = styles.shopping;

                  const c = budget.category.toLowerCase();

                  if (c.includes("food")) style = styles.food;
                  else if (c.includes("shopping")) style = styles.shopping;
                  else if (c.includes("entertainment")) style = styles.entertainment;
                  else if (c.includes("transport")) style = styles.transport;
                  else if (c.includes("health")) style = styles.health;
                  else if (c.includes("education")) style = styles.education;
                  else if (c.includes("bill")) style = styles.bills;

                  return (
                    <div
                      key={budget._id}
                      className="
                        bg-white/[0.03]
                        border border-white/10
                        rounded-3xl
                        p-6
                        hover:border-violet-500/30
                        transition-all
                      "
                    >

                      {/* TOP */}
                      <div className="flex justify-between items-start">

                        <div className="flex items-center gap-4">

                          <div
                            className={`
                              w-14 h-14 rounded-2xl
                              flex items-center justify-center
                              ${style.icon}
                            `}
                          >
                            {categoryIcon(budget.category)}
                          </div>

                          <div>
                            <h3 className="font-bold text-lg capitalize">
                              {budget.category}
                            </h3>

                            <p className="text-gray-400 text-sm">
                              {budget.month}
                            </p>
                          </div>

                        </div>

                        <button
                          onClick={() =>
                            deleteBudget(budget._id)
                          }
                          className="text-gray-400 hover:text-white"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                      </div>

                      {/* VALUES */}
                      <div className="mt-8">

                        <div className="flex items-end gap-2">
                          <h2 className="text-3xl font-bold">
                            ₹{budget.spent}
                          </h2>

                          <span className="text-gray-400 mb-1">
                            / ₹{budget.limit}
                          </span>
                        </div>

                        {/* BAR */}
                        <div className="mt-5 h-3 bg-white/10 rounded-full overflow-hidden">

                          <div
                            className={`h-full rounded-full ${style.bar}`}
                            style={{
                              width: `${Math.min(percent, 100)}%`,
                            }}
                          />

                        </div>

                        {/* BOTTOM */}
                        <div className="flex items-center justify-between mt-4">

                          <span className={`font-semibold ${style.text}`}>
                            {percent}%
                          </span>

                          {exceeded ? (
                            <span className="text-red-400 text-sm font-medium">
                              Over Limit
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              ₹{budget.limit - budget.spent} left
                            </span>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* RIGHT PANEL */}
            <div>

              <div
                className="
                  rounded-3xl
                  border border-white/10
                  bg-[#111827]
                  p-6
                  sticky top-28
                "
              >

                <div className="flex items-center justify-between mb-8">

                  <h2 className="text-2xl font-bold">
                    Budget Health
                  </h2>

                  <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                    This Month
                  </button>

                </div>

                <div className="w-56 h-56 mx-auto">

                  <CircularProgressbar
                    value={summary.percentage}
                    text={`${summary.percentage}%`}
                    styles={buildStyles({
                      textColor: "#fff",
                      trailColor: "#1e293b",
                      pathColor: "#8b5cf6",
                    })}
                  />

                </div>

                <div className="text-center mt-6">

                  <h3 className="text-xl font-bold">
                    You're doing great!
                  </h3>

                  <p className="text-gray-400 mt-2">
                    You have ₹{summary.remaining} left to spend.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* MODAL */}
          {showForm && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

              <form
                onSubmit={addBudget}
                className="
                  w-full max-w-md
                  rounded-3xl
                  border border-white/10
                  bg-[#111827]
                  p-8
                "
              >

                <h2 className="text-3xl font-bold mb-7">
                  Add Budget
                </h2>

                <div className="space-y-4">

                  <input
                    required
                    placeholder="Month (Example: May 2026)"
                    value={form.month}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        month: e.target.value,
                      })
                    }
                    className="
                      w-full p-4 rounded-2xl
                      bg-white/[0.05]
                      border border-white/10
                      outline-none
                    "
                  />

                  <input
                    required
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="
                      w-full p-4 rounded-2xl
                      bg-white/[0.05]
                      border border-white/10
                      outline-none
                    "
                  />

                  <input
                    required
                    type="number"
                    placeholder="Budget Limit"
                    value={form.limit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        limit: e.target.value,
                      })
                    }
                    className="
                      w-full p-4 rounded-2xl
                      bg-white/[0.05]
                      border border-white/10
                      outline-none
                    "
                  />

                </div>

                <div className="flex gap-4 mt-8">

                  <button
                    type="submit"
                    className="
                      flex-1 py-4 rounded-2xl
                      bg-gradient-to-r
                      from-violet-600 to-blue-500
                      font-semibold
                    "
                  >
                    Add Budget
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="
                      flex-1 py-4 rounded-2xl
                      bg-white/[0.05]
                      border border-white/10
                    "
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// import { useState, useEffect, useRef, useMemo } from "react";
// import axios from "axios";
// import API from "../utils/api";

// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";

// import { Toaster, toast } from "react-hot-toast";
// import { motion } from "framer-motion";

// import {
//   Plus,
//   MoreHorizontal,
//   ShoppingBag,
//   Car,
//   Utensils,
//   HeartPulse,
//   GraduationCap,
//   Wallet,
//   Tv,
//   Zap,
//   AlertTriangle,
// } from "lucide-react";

// import {
//   CircularProgressbar,
//   buildStyles,
// } from "react-circular-progressbar";

// import "react-circular-progressbar/dist/styles.css";

// export default function Budgets() {
//   const [budgets, setBudgets] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   const [form, setForm] = useState({
//     month: "",
//     category: "",
//     limit: "",
//   });

//   const shownExceedAlerts = useRef(new Set());

//   /* ================= FETCH ================= */

//   const fetchBudgets = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user?._id) return;

//     try {
//       const res = await axios.get(
//         `${API}/budgets?userId=${user._id}`
//       );

//       const safeBudgets = Array.isArray(res.data)
//         ? res.data.map((b) => ({
//             ...b,
//             spent: Number(b.spent || 0),
//             limit: Number(b.limit || 0),
//           }))
//         : [];

//       setBudgets(safeBudgets);

//       safeBudgets.forEach((b) => {
//         if (
//           b.spent > b.limit &&
//           !shownExceedAlerts.current.has(b._id)
//         ) {
//           toast.error(`Budget exceeded in ${b.category}`);

//           shownExceedAlerts.current.add(b._id);
//         }
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load budgets");
//     }
//   };

//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   /* ================= ADD ================= */

//   const addBudget = async (e) => {
//     e.preventDefault();

//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user?._id) {
//       toast.error("Please login");
//       return;
//     }

//     try {
//       await axios.post(`${API}/budgets/add`, {
//         ...form,
//         limit: Number(form.limit),
//         userId: user._id,
//       });

//       toast.success("Budget added");

//       setForm({
//         month: "",
//         category: "",
//         limit: "",
//       });

//       setShowForm(false);

//       fetchBudgets();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add budget");
//     }
//   };

//   /* ================= DELETE ================= */

//   const deleteBudget = async (id) => {
//     try {
//       await axios.delete(`${API}/budgets/${id}`);

//       toast.success("Budget deleted");

//       fetchBudgets();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete");
//     }
//   };

//   /* ================= SUMMARY ================= */

//   const summary = useMemo(() => {
//     const totalLimit = budgets.reduce(
//       (acc, item) => acc + item.limit,
//       0
//     );

//     const totalSpent = budgets.reduce(
//       (acc, item) => acc + item.spent,
//       0
//     );

//     return {
//       totalBudgets: budgets.length,
//       totalLimit,
//       totalSpent,
//       remaining: totalLimit - totalSpent,
//     };
//   }, [budgets]);

//   /* ================= ICONS ================= */

//   const categoryIcon = (category) => {
//     const c = category?.toLowerCase();

//     if (c?.includes("food"))
//       return <Utensils size={20} />;

//     if (c?.includes("shopping"))
//       return <ShoppingBag size={20} />;

//     if (c?.includes("car"))
//       return <Car size={20} />;

//     if (c?.includes("health"))
//       return <HeartPulse size={20} />;

//     if (c?.includes("education"))
//       return <GraduationCap size={20} />;

//     if (c?.includes("entertainment"))
//       return <Tv size={20} />;

//     if (c?.includes("bill"))
//       return <Zap size={20} />;

//     return <Wallet size={20} />;
//   };

//   /* ================= COLORS ================= */

//   const categoryColor = (category) => {
//     const c = category?.toLowerCase();

//     if (c?.includes("food"))
//       return "#f97316";

//     if (c?.includes("shopping"))
//       return "#8b5cf6";

//     if (c?.includes("car"))
//       return "#06b6d4";

//     if (c?.includes("health"))
//       return "#ef4444";

//     if (c?.includes("education"))
//       return "#10b981";

//     return "#7c3aed";
//   };

//   return (
//     <div className="min-h-screen bg-[#060816] text-white overflow-hidden">

//       <div className="flex">

//         {/* SIDEBAR */}
//         <div className="hidden lg:block">
//           <Sidebar />
//         </div>

//         {/* MAIN */}
//         <div className="flex-1 min-w-0 flex flex-col">

//           <Topbar />

//           <Toaster position="top-right" />

//           <main className="p-4 sm:p-6 lg:p-10">

//             {/* HEADER */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

//               <div>
//                 <h1
//                   className="text-4xl font-black text-transparent bg-clip-text"
//                   style={{
//                     backgroundImage:
//                       "linear-gradient(90deg,#c084fc,#7c3aed,#60a5fa)",
//                   }}
//                 >
//                   Budget Overview
//                 </h1>

//                 <p className="text-gray-400 mt-2">
//                   Control spending with smart budget tracking
//                 </p>
//               </div>

//               <button
//                 onClick={() => setShowForm(true)}
//                 className="
//                   flex items-center gap-2
//                   px-6 py-3 rounded-2xl
//                   bg-gradient-to-r from-violet-600 to-blue-500
//                   hover:scale-105 transition-all
//                   shadow-[0_0_30px_rgba(139,92,246,0.35)]
//                 "
//               >
//                 <Plus size={18} />
//                 Add Budget
//               </button>
//             </div>

//             {/* SUMMARY CARDS */}

//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

//               {[
//                 {
//                   title: "Total Budgets",
//                   value: summary.totalBudgets,
//                 },
//                 {
//                   title: "Budget Limit",
//                   value: `₹${summary.totalLimit}`,
//                 },
//                 {
//                   title: "Spent",
//                   value: `₹${summary.totalSpent}`,
//                 },
//                 {
//                   title: "Remaining",
//                   value: `₹${summary.remaining}`,
//                 },
//               ].map((item, i) => (
//                 <motion.div
//                   whileHover={{ y: -5 }}
//                   key={i}
//                   className="
//                     rounded-3xl p-6
//                     border border-white/10
//                     bg-white/[0.04]
//                     backdrop-blur-xl
//                   "
//                 >
//                   <p className="text-gray-400 text-sm">
//                     {item.title}
//                   </p>

//                   <h2 className="text-3xl font-bold mt-3">
//                     {item.value}
//                   </h2>
//                 </motion.div>
//               ))}
//             </div>

//             {/* BUDGET GRID */}

//             <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-7">

//               {budgets.map((budget) => {
//                 const percent =
//                   budget.limit > 0
//                     ? Math.min(
//                         (budget.spent / budget.limit) * 100,
//                         100
//                       )
//                     : 0;

//                 const exceeded = budget.spent > budget.limit;

//                 return (
//                   <motion.div
//                     whileHover={{
//                       y: -6,
//                     }}
//                     key={budget._id}
//                     className="
//                       relative overflow-hidden
//                       rounded-[30px]
//                       border border-white/10
//                       bg-[#121826]
//                       p-6
//                       shadow-2xl
//                     "
//                   >

//                     {/* TOP */}

//                     <div className="flex items-start justify-between">

//                       <div className="flex items-center gap-4">

//                         <div
//                           className="
//                             w-14 h-14 rounded-2xl
//                             flex items-center justify-center
//                           "
//                           style={{
//                             background: `${categoryColor(
//                               budget.category
//                             )}20`,
//                             color: categoryColor(
//                               budget.category
//                             ),
//                           }}
//                         >
//                           {categoryIcon(budget.category)}
//                         </div>

//                         <div>
//                           <h3 className="text-lg font-bold capitalize">
//                             {budget.category}
//                           </h3>

//                           <p className="text-gray-400 text-sm">
//                             {budget.month}
//                           </p>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() =>
//                           deleteBudget(budget._id)
//                         }
//                         className="
//                           w-10 h-10 rounded-xl
//                           bg-white/[0.05]
//                           flex items-center justify-center
//                         "
//                       >
//                         <MoreHorizontal size={18} />
//                       </button>
//                     </div>

//                     {/* CIRCLE */}

//                     <div className="w-40 h-40 mx-auto my-8">

//                       <CircularProgressbar
//                         value={percent}
//                         text={`${Math.round(percent)}%`}
//                         styles={buildStyles({
//                           pathColor: exceeded
//                             ? "#ef4444"
//                             : categoryColor(
//                                 budget.category
//                               ),
//                           textColor: "#fff",
//                           trailColor: "#1e293b",
//                         })}
//                       />

//                     </div>

//                     {/* VALUES */}

//                     <div className="space-y-4">

//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-400">
//                           Spent
//                         </span>

//                         <span className="font-semibold">
//                           ₹{budget.spent}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-400">
//                           Budget
//                         </span>

//                         <span className="font-semibold">
//                           ₹{budget.limit}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-400">
//                           Remaining
//                         </span>

//                         <span
//                           className={`font-semibold ${
//                             exceeded
//                               ? "text-red-400"
//                               : "text-emerald-400"
//                           }`}
//                         >
//                           ₹{budget.limit - budget.spent}
//                         </span>
//                       </div>

//                     </div>

//                     {/* WARNING */}

//                     {exceeded && (
//                       <div
//                         className="
//                           mt-5 rounded-2xl
//                           bg-red-500/10
//                           border border-red-500/20
//                           p-3 flex items-center gap-3
//                         "
//                       >
//                         <AlertTriangle
//                           size={18}
//                           className="text-red-400"
//                         />

//                         <p className="text-sm text-red-300">
//                           Budget exceeded
//                         </p>
//                       </div>
//                     )}

//                   </motion.div>
//                 );
//               })}
//             </div>

//             {/* MODAL */}

//             {showForm && (
//               <div
//                 className="
//                   fixed inset-0 z-50
//                   bg-black/60 backdrop-blur-sm
//                   flex items-center justify-center
//                   p-4
//                 "
//               >
//                 <form
//                   onSubmit={addBudget}
//                   className="
//                     w-full max-w-md
//                     rounded-3xl
//                     border border-white/10
//                     bg-[#111827]
//                     p-8
//                   "
//                 >

//                   <h2 className="text-2xl font-bold mb-6">
//                     Add Budget
//                   </h2>

//                   <div className="space-y-4">

//                     <input
//                       required
//                       placeholder="Month (Example: July 2026)"
//                       value={form.month}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           month: e.target.value,
//                         })
//                       }
//                       className="
//                         w-full rounded-2xl
//                         bg-white/[0.05]
//                         border border-white/10
//                         p-4 outline-none
//                       "
//                     />

//                     <input
//                       required
//                       placeholder="Category"
//                       value={form.category}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           category: e.target.value,
//                         })
//                       }
//                       className="
//                         w-full rounded-2xl
//                         bg-white/[0.05]
//                         border border-white/10
//                         p-4 outline-none
//                       "
//                     />

//                     <input
//                       required
//                       type="number"
//                       placeholder="Budget Limit"
//                       value={form.limit}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           limit: e.target.value,
//                         })
//                       }
//                       className="
//                         w-full rounded-2xl
//                         bg-white/[0.05]
//                         border border-white/10
//                         p-4 outline-none
//                       "
//                     />

//                   </div>

//                   <div className="flex gap-4 mt-8">

//                     <button
//                       type="submit"
//                       className="
//                         flex-1 py-4 rounded-2xl
//                         bg-gradient-to-r
//                         from-violet-600 to-blue-500
//                         font-semibold
//                       "
//                     >
//                       Add Budget
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowForm(false)
//                       }
//                       className="
//                         flex-1 py-4 rounded-2xl
//                         bg-white/[0.06]
//                         border border-white/10
//                       "
//                     >
//                       Cancel
//                     </button>

//                   </div>

//                 </form>
//               </div>
//             )}

//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }





