import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Toaster, toast } from "react-hot-toast";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    month: "",
    category: "",
    limit: "",
  });

  const shownExceedAlerts = useRef(new Set());

  /* ===================== FETCH ===================== */
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

      // 🚨 exceed alert (once per budget)
      safeBudgets.forEach((b) => {
        if (b.spent > b.limit && !shownExceedAlerts.current.has(b._id)) {
          toast.error(`⚠️ Budget exceeded in ${b.category}`, {
            style: {
              background: "#3b082f",
              color: "#ffdede",
              fontWeight: 700,
            },
          });
          shownExceedAlerts.current.add(b._id);
        }
      });
    } catch (err) {
      console.error("Error fetching budgets", err);
      toast.error("Failed to load budgets");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  /* ===================== ADD ===================== */
  const addBudget = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return toast.error("Please login");

    try {
      await axios.post(`${API}/budgets/add`, {
        ...form,
        limit: Number(form.limit),
        userId: user._id,
      });

      setForm({ month: "", category: "", limit: "" });
      setShowForm(false);
      fetchBudgets();
      toast.success("Budget added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add budget");
    }
  };

  /* ===================== DELETE ===================== */
  const deleteBudget = async (id) => {
    try {
      await axios.delete(`${API}/budgets/${id}`);
      shownExceedAlerts.current.delete(id);
      fetchBudgets();
      toast.success("Budget deleted");
    } catch {
      toast.error("Failed to delete budget");
    }
  };

  /* ===================== SUMMARY ===================== */
  const summary = useMemo(() => {
    const totalLimit = budgets.reduce((a, b) => a + b.limit, 0);
    const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
    return {
      totalBudgets: budgets.length,
      totalLimit,
      totalSpent,
      remaining: totalLimit - totalSpent,
    };
  }, [budgets]);

  /* ===================== STYLES ===================== */
  const accentForCategory = (cat) => {
    if (!cat) return "linear-gradient(90deg,#5eead4,#60a5fa)";
    const c = cat.toLowerCase();
    if (c.includes("food")) return "linear-gradient(90deg,#ff8a80,#f48fb1)";
    if (c.includes("rent") || c.includes("bill"))
      return "linear-gradient(90deg,#f59e0b,#f97316)";
    return "linear-gradient(90deg,#7c3aed,#60a5fa)";
  };

  return (
    <div className="flex min-h-screen bg-[#050611]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <Toaster position="top-right" />

        <main className="p-10 space-y-10">
          {/* HEADER */}
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)" }}>
              Budgets
            </h1>
            <p className="text-gray-300 mt-2">
              Track monthly limits & control your spending ✨
            </p>
          </div>

          {/* ADD */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2 rounded-full text-white"
              style={{ background: "linear-gradient(90deg,#7c3aed,#60a5fa)" }}
            >
              + Add Budget
            </button>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Budgets", value: summary.totalBudgets },
              { label: "Total Limit", value: `₹${summary.totalLimit}` },
              { label: "Total Spent", value: `₹${summary.totalSpent}` },
              { label: "Remaining", value: `₹${summary.remaining}` },
            ].map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow">
                <p className="text-sm text-gray-500">{c.label}</p>
                <h2 className="text-2xl font-semibold">{c.value}</h2>
              </div>
            ))}
          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {budgets.map((b) => {
              const percent =
                b.limit > 0 ? Math.min((b.spent / b.limit) * 100, 100) : 0;

              return (
                <div key={b._id} className="bg-white p-6 rounded-2xl shadow relative">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{ background: accentForCategory(b.category) }}
                  />
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{b.category}</p>
                      <p className="text-sm text-gray-500">{b.month}</p>
                    </div>
                    <button onClick={() => deleteBudget(b._id)}>✕</button>
                  </div>

                  <p className="mt-4 text-sm">
                    ₹{b.spent} / ₹{b.limit}
                  </p>

                  <div className="h-3 bg-gray-200 rounded-full mt-3">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percent}%`,
                        background:
                          b.spent > b.limit
                            ? "linear-gradient(90deg,#fb7185,#f97316)"
                            : accentForCategory(b.category),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* MODAL */}
          {showForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
              <form onSubmit={addBudget} className="bg-white p-6 rounded-xl w-80">
                <h2 className="font-semibold mb-4">Add Budget</h2>

                <input
                  required
                  placeholder="Month"
                  className="w-full p-2 mb-3 border rounded"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                />

                <input
                  required
                  placeholder="Category"
                  className="w-full p-2 mb-3 border rounded"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <input
                  required
                  type="number"
                  placeholder="Limit"
                  className="w-full p-2 mb-4 border rounded"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                />

                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 text-white py-2 rounded">
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 py-2 rounded"
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









// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import { Toaster, toast } from "react-hot-toast";

// export default function Budgets() {
//   const [budgets, setBudgets] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     month: "",
//     category: "",
//     limit: "",
//   });

//   const shownExceedAlerts = useRef(new Set());

//   const fetchBudgets = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/budgets?userId=${user._id}`
//       );

//       setBudgets(res.data);

//       const exceeded = res.data.filter((b) => b.spent > b.limit);
//       exceeded.forEach((b) => {
//         if (!shownExceedAlerts.current.has(b._id)) {
//           toast.error(`⚠️ Budget exceeded in ${b.category}`, {
//             style: { background: "#3b082f", color: "#ffdede", fontWeight: 700 },
//           });
//           shownExceedAlerts.current.add(b._id);
//         }
//       });
//     } catch (err) {
//       console.error("Error fetching budgets", err);
//     }
//   };

//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   const addBudget = async (e) => {
//     e.preventDefault();
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user || !user._id) {
//       toast.error("Please log in before adding budgets.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/budgets/add", {
//         ...form,
//         userId: user._id,
//       });

//       setForm({ month: "", category: "", limit: "" });
//       setShowForm(false);
//       fetchBudgets();

//       toast.success("Budget added!");
//     } catch (err) {
//       console.error("Error adding budget:", err);
//       toast.error("Failed to add budget");
//     }
//   };

//   const deleteBudget = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/budgets/${id}`);
//       shownExceedAlerts.current.delete(id);
//       fetchBudgets();
//       toast("Budget deleted");
//     } catch (err) {
//       console.error("Error deleting budget:", err);
//       toast.error("Failed to delete budget");
//     }
//   };

//   const accentForCategory = (cat) => {
//     if (!cat) return "linear-gradient(90deg,#5eead4,#60a5fa)";
//     const c = cat.toLowerCase();
//     if (c.includes("food")) return "linear-gradient(90deg,#ff8a80,#f48fb1)";
//     if (c.includes("online") || c.includes("payment") || c.includes("card"))
//       return "linear-gradient(90deg,#7c3aed,#60a5fa)";
//     if (c.includes("rent") || c.includes("bills"))
//       return "linear-gradient(90deg,#f59e0b,#f97316)";
//     return "linear-gradient(90deg,#7c3aed,#60a5fa)";
//   };

//   return (
//     <div className="flex min-h-screen w-full overflow-hidden bg-[#050611]">

//       <Sidebar />

//       <div
//         className="flex-1 flex flex-col relative min-h-screen w-full overflow-y-auto"
//         style={{
//           background:
//             "linear-gradient(180deg, #050611 0%, #0b0713 55%, #09041a 100%)",
//         }}
//       >
//         <Topbar />
//         <Toaster position="top-right" />

//         <main className="relative z-10 p-10 pb-20 min-h-screen w-full">

//           {/* HEADER like Dashboard */}
//           <div className="mb-10">
//             <h1
//               className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text"
//               style={{
//                 backgroundImage:
//                   "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
//               }}
//             >
//               Budgets
//             </h1>
//             <p className="text-gray-300 mt-3 max-w-xl">
//               Track monthly limits & control your spending ✨
//             </p>
//           </div>

//           {/* Add Button */}
//           <div className="flex justify-end mb-10">
//             <button
//               onClick={() => setShowForm(true)}
//               className="px-5 py-2.5 rounded-full shadow-lg transform hover:scale-[1.03] transition text-white"
//               style={{
//                 background: "linear-gradient(90deg,#7c3aed,#60a5fa)",
//                 boxShadow: "0 8px 30px rgba(124,58,237,0.18)",
//               }}
//             >
//               + Add Budget
//             </button>
//           </div>

//           {/* WHITE SUMMARY CARDS LIKE DASHBOARD */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//             {[
//               { label: "Total Budgets", value: budgets.length },
//               {
//                 label: "Total Limit",
//                 value: `₹${budgets.reduce((a, b) => a + Number(b.limit), 0)}`,
//               },
//               {
//                 label: "Total Spent",
//                 value: `₹${budgets.reduce((a, b) => a + Number(b.spent), 0)}`,
//               },
//               {
//                 label: "Remaining",
//                 value: `₹${budgets.reduce(
//                   (a, b) => a + (b.limit - b.spent),
//                   0
//                 )}`,
//               },
//             ].map((c, i) => (
//               <div
//                 key={i}
//                 className="rounded-2xl p-6 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition"
//               >
//                 <p className="text-sm text-gray-500">{c.label}</p>
//                 <h2 className="text-2xl font-semibold mt-1 text-gray-900">
//                   {c.value}
//                 </h2>
//               </div>
//             ))}
//           </div>

//           {/* SECTION TITLE */}
//           <h2 className="text-xl font-semibold text-white mb-5">Your Budgets</h2>

//           {/* BUDGET LIST */}
//           {budgets.length === 0 ? (
//             <div className="text-center py-20 text-gray-400">No budgets yet.</div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
//               {budgets.map((b) => {
//                 const percentage = Math.min((b.spent / b.limit) * 100, 100);
//                 const accent = accentForCategory(b.category);

//                 return (
//                   <div
//                     key={b._id}
//                     className="relative p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition"
//                   >
//                     {/* Accent Bar */}
//                     <div
//                       className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
//                       style={{ background: accent }}
//                     />

//                     {/* Top */}
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-lg font-semibold text-gray-900 capitalize">
//                           {b.category}
//                         </p>
//                         <p className="text-sm text-gray-500">{b.month}</p>
//                       </div>

//                       <button
//                         onClick={() => deleteBudget(b._id)}
//                         className="text-gray-400 hover:text-red-500 text-lg"
//                       >
//                         ✕
//                       </button>
//                     </div>

//                     {/* Spent / Limit */}
//                     <p className="text-sm text-gray-700 mt-4">
//                       Spent:{" "}
//                       <span className="font-semibold text-gray-900">
//                         ₹{b.spent}
//                       </span>{" "}
//                       / ₹{b.limit}
//                     </p>

//                     {/* Progress */}
//                     <div className="w-full mt-4 h-3 rounded-full bg-gray-200 overflow-hidden">
//                       <div
//                         style={{
//                           width: `${percentage}%`,
//                           background:
//                             b.spent > b.limit
//                               ? "linear-gradient(90deg,#fb7185,#f97316)"
//                               : accent,
//                         }}
//                         className="h-full transition-all duration-700"
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* ADD BUDGET MODAL */}
//           {showForm && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//               <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-200">
//                 <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                   Add Budget
//                 </h2>

//                 <form onSubmit={addBudget} className="space-y-4">
//                   <div>
//                     <label className="text-gray-700 text-sm font-medium">
//                       Month
//                     </label>
//                     <input
//                       type="text"
//                       value={form.month}
//                       onChange={(e) =>
//                         setForm({ ...form, month: e.target.value })
//                       }
//                       placeholder="e.g. December"
//                       className="w-full mt-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="text-gray-700 text-sm font-medium">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       value={form.category}
//                       onChange={(e) =>
//                         setForm({ ...form, category: e.target.value })
//                       }
//                       placeholder="e.g. Food"
//                       className="w-full mt-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="text-gray-700 text-sm font-medium">
//                       Limit (₹)
//                     </label>
//                     <input
//                       type="number"
//                       value={form.limit}
//                       onChange={(e) =>
//                         setForm({ ...form, limit: e.target.value })
//                       }
//                       placeholder="5000"
//                       className="w-full mt-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
//                       required
//                     />
//                   </div>

//                   <div className="flex justify-end gap-3 pt-3">
//                     <button
//                       type="button"
//                       onClick={() => setShowForm(false)}
//                       className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     >
//                       Cancel
//                     </button>

//                     <button
//                       type="submit"
//                       className="px-4 py-2 rounded-lg text-white"
//                       style={{
//                         background: "linear-gradient(90deg,#7c3aed,#60a5fa)",
//                       }}
//                     >
//                       Add Budget
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import { Toaster, toast } from "react-hot-toast";

// export default function Budgets() {
//   const [budgets, setBudgets] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     month: "",
//     category: "",
//     limit: "",
//   });

//   const shownExceedAlerts = useRef(new Set());

//   const fetchBudgets = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/budgets?userId=${user._id}`
//       );

//       setBudgets(res.data);

//       const exceeded = res.data.filter((b) => b.spent > b.limit);
//       exceeded.forEach((b) => {
//         if (!shownExceedAlerts.current.has(b._id)) {
//           toast.error(`⚠️ Budget exceeded in ${b.category}`, {
//             style: { background: "#3b082f", color: "#ffdede", fontWeight: 700 },
//           });
//           shownExceedAlerts.current.add(b._id);
//         }
//       });
//     } catch (err) {
//       console.error("Error fetching budgets", err);
//     }
//   };

//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   const addBudget = async (e) => {
//     e.preventDefault();
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) {
//       toast.error("Please log in before adding budgets.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/budgets/add", {
//         ...form,
//         userId: user._id,
//       });

//       setForm({ month: "", category: "", limit: "" });
//       setShowForm(false);
//       fetchBudgets();
//       toast.success("Budget added!");
//     } catch (err) {
//       console.error("Error adding budget:", err);
//       toast.error("Failed to add budget");
//     }
//   };

//   const deleteBudget = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/budgets/${id}`);
//       shownExceedAlerts.current.delete(id);
//       fetchBudgets();
//       toast("Budget deleted");
//     } catch (err) {
//       console.error("Error deleting budget:", err);
//       toast.error("Failed to delete budget");
//     }
//   };

//   const accentForCategory = (cat) => {
//     if (!cat) return "linear-gradient(90deg,#5eead4,#60a5fa)";
//     const c = cat.toLowerCase();
//     if (c.includes("food")) return "linear-gradient(90deg,#ff8a80,#f48fb1)";
//     if (c.includes("online") || c.includes("payment") || c.includes("card"))
//       return "linear-gradient(90deg,#7c3aed,#60a5fa)";
//     if (c.includes("rent") || c.includes("bills"))
//       return "linear-gradient(90deg,#f59e0b,#f97316)";
//     return "linear-gradient(90deg,#7c3aed,#60a5fa)";
//   };

//   return (
//     <div className="flex min-h-screen w-full overflow-hidden bg-[#050611]">

//       <Sidebar />

//       <div
//         className="flex-1 flex flex-col relative min-h-screen w-full overflow-y-auto"
//         style={{
//           background:
//             "linear-gradient(180deg, #050611 0%, #0b0713 55%, #09041a 100%)",
//         }}
//       >
//         <Topbar />
//         <Toaster position="top-right" />

//         <main className="relative z-10 p-10 pb-20 min-h-screen w-full">

//           {/* Header */}
//           <div className="flex items-start justify-between mb-10">
//             <div>
//               <h1
//                 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text"
//                 style={{
//                   backgroundImage:
//                     "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
//                 }}
//               >
//                 Budgets
//               </h1>
//               <p className="text-gray-300 mt-3 max-w-xl">
//                 Track limits & control your monthly spending — in dark galaxy mode ✨
//               </p>
//             </div>

//             <button
//               onClick={() => setShowForm(true)}
//               className="px-5 py-2.5 rounded-full shadow-lg transform hover:scale-[1.03] transition text-white"
//               style={{
//                 background: "linear-gradient(90deg,#7c3aed,#60a5fa)",
//                 boxShadow: "0 8px 30px rgba(124,58,237,0.18)",
//               }}
//             >
//               + Add Budget
//             </button>
//           </div>

//           {/* Summary */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//             {[
//               { label: "Total Budgets", value: budgets.length },
//               {
//                 label: "Total Limit",
//                 value: `₹${budgets.reduce((a, b) => a + Number(b.limit), 0)}`,
//               },
//               {
//                 label: "Total Spent",
//                 value: `₹${budgets.reduce((a, b) => a + Number(b.spent), 0)}`,
//               },
//               {
//                 label: "Remaining",
//                 value: `₹${budgets.reduce((a, b) => a + (b.limit - b.spent), 0)}`,
//               },
//             ].map((c, i) => (
// <div
//   className="rounded-2xl p-6"
//   style={{
//     background: "rgba(255,255,255,0.12)",
//     border: "1px solid rgba(255,255,255,0.25)",
//     boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
//     backdropFilter: "blur(12px)"
//   }}
// >

//                 <p className="text-sm text-gray-300">{c.label}</p>
//                 <h2 className="text-2xl font-semibold mt-1 text-white">{c.value}</h2>
//               </div>
//             ))}
//           </div>

//           {/* Budget List */}
//           <h2 className="text-xl font-semibold text-white mb-5">Your Budgets</h2>

//           {budgets.length === 0 ? (
//             <div className="text-center py-20 text-gray-400">
//               No budgets yet.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
//               {budgets.map((b) => {
//                 const percentage = Math.min((b.spent / b.limit) * 100, 100);
//                 const accent = accentForCategory(b.category);

//                 return (
// <div
//   key={b._id}
//   className="relative p-6 rounded-2xl"
//   style={{
//     background: "rgba(255,255,255,0.14)",
//     border: "1px solid rgba(255,255,255,0.3)",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.38)",
//     backdropFilter: "blur(14px)"
//   }}
// >

//                     <div
//                       className="absolute left-0 top-0 h-full w-1"
//                       style={{ background: accent }}
//                     />

//                     <div className="flex justify-between">
//                       <div>
//                         <p className="text-lg font-semibold text-white capitalize">
//                           {b.category}
//                         </p>
//                         <p className="text-sm text-gray-300">{b.month}</p>
//                       </div>
//                       <button
//                         onClick={() => deleteBudget(b._id)}
//                         className="text-gray-300 hover:text-red-400 text-lg"
//                       >
//                         ✕
//                       </button>
//                     </div>

//                     <p className="text-sm text-gray-300 mt-4">
//                       Spent: <span className="text-white">₹{b.spent}</span> / ₹{b.limit}
//                     </p>

//                     <div className="w-full mt-4 h-3 rounded-full bg-gray-800 overflow-hidden">
//                       <div
//                         style={{
//                           width: `${percentage}%`,
//                           background:
//                             b.spent > b.limit
//                               ? "linear-gradient(90deg,#fb7185,#f97316)"
//                               : accent,
//                         }}
//                         className="h-full transition-all duration-700"
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }



// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import { Toaster, toast } from "react-hot-toast";

// export default function Budgets() {
//   const [budgets, setBudgets] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     month: "",
//     category: "",
//     limit: "",
//   });

//   const shownExceedAlerts = useRef(new Set());

//   const fetchBudgets = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/budgets?userId=${user._id}`
//       );

//       setBudgets(res.data);

//       const exceeded = res.data.filter((b) => b.spent > b.limit);
//       exceeded.forEach((b) => {
//         if (!shownExceedAlerts.current.has(b._id)) {
//           toast.error(`⚠️ Budget exceeded in ${b.category}`, {
//             style: { background: "#3b082f", color: "#ffdede", fontWeight: 700 },
//           });
//           shownExceedAlerts.current.add(b._id);
//         }
//       });
//     } catch (err) {
//       console.error("Error fetching budgets", err);
//     }
//   };

//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   const addBudget = async (e) => {
//     e.preventDefault();
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) {
//       toast.error("Please log in before adding budgets.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/budgets/add", {
//         ...form,
//         userId: user._id,
//       });

//       setForm({ month: "", category: "", limit: "" });
//       setShowForm(false);
//       fetchBudgets();
//       toast.success("Budget added!");
//     } catch (err) {
//       console.error("Error adding budget:", err);
//       toast.error("Failed to add budget");
//     }
//   };

//   const deleteBudget = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/budgets/${id}`);
//       shownExceedAlerts.current.delete(id);
//       fetchBudgets();
//       toast("Budget deleted");
//     } catch (err) {
//       console.error("Error deleting budget:", err);
//       toast.error("Failed to delete budget");
//     }
//   };

//   const accentForCategory = (cat) => {
//     if (!cat) return "linear-gradient(90deg,#5eead4,#60a5fa)";
//     const c = cat.toLowerCase();
//     if (c.includes("food")) return "linear-gradient(90deg,#ff8a80,#f48fb1)";
//     if (c.includes("online") || c.includes("payment") || c.includes("card"))
//       return "linear-gradient(90deg,#7c3aed,#60a5fa)";
//     if (c.includes("rent") || c.includes("bills"))
//       return "linear-gradient(90deg,#f59e0b,#f97316)";
//     return "linear-gradient(90deg,#7c3aed,#60a5fa)";
//   };

//   return (
//     <div className="flex h-screen w-full overflow-hidden">

//       <Sidebar />

//       <div className="flex-1 flex flex-col relative h-full overflow-y-auto w-full">

//         <Topbar />
//         <Toaster position="top-right" />

//         {/* BACKGROUND */}
//         <div className="absolute inset-0 -z-20">
//           <div
//             className="absolute inset-0"
//             style={{
//               background:
//                 "radial-gradient(1200px 600px at 10% 10%, rgba(67,56,202,0.14), transparent 12%)," +
//                 "radial-gradient(900px 500px at 85% 20%, rgba(220, 95, 255, 0.08), transparent 18%)," +
//                 "linear-gradient(180deg, #050611 0%, #0b0713 60%, #09041a 100%)",
//             }}
//           />

//           <div
//             style={{ filter: "blur(60px)", opacity: 0.6 }}
//             className="absolute -top-48 -right-48 w-[720px] h-[720px] rounded-full"
//           >
//             <div
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 background:
//                   "radial-gradient(circle at 25% 30%, rgba(124,58,237,0.26), rgba(124,58,237,0.08) 20%, rgba(0,0,0,0) 45%)," +
//                   "radial-gradient(circle at 70% 60%, rgba(79,70,229,0.20), rgba(99,102,241,0.06) 25%, rgba(0,0,0,0) 50%)",
//               }}
//             />
//           </div>

//           <div
//             style={{ filter: "blur(40px)", opacity: 0.45 }}
//             className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full"
//           >
//             <div
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 background:
//                   "radial-gradient(circle at 40% 40%, rgba(255,99,132,0.09), rgba(255,200,255,0.03) 20%, rgba(0,0,0,0) 60%)",
//               }}
//             />
//           </div>
//         </div>

//         {/* CONTENT FIXED */}
//         <main className="relative z-10 p-10 h-full w-full">

//           <div className="flex items-start justify-between mb-10">
//             <div>
//               <h1
//                 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text"
//                 style={{
//                   backgroundImage:
//                     "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
//                 }}
//               >
//                 Budgets
//               </h1>

//               <p className="text-gray-300 mt-3 max-w-xl">
//                 Track limits & control your monthly spending — in dark galaxy mode ✨
//               </p>
//             </div>

//             <button
//               onClick={() => setShowForm(true)}
//               className="px-5 py-2.5 rounded-full shadow-lg transform hover:scale-[1.03] transition text-white"
//               style={{
//                 background: "linear-gradient(90deg,#7c3aed,#60a5fa)",
//                 boxShadow: "0 8px 30px rgba(124,58,237,0.18)",
//               }}
//             >
//               + Add Budget
//             </button>
//           </div>

//           {/* Summary */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//             {[ 
//               { label: "Total Budgets", value: budgets.length },
//               {
//                 label: "Total Limit",
//                 value: `₹${budgets.reduce((a, b) => a + Number(b.limit), 0)}`,
//               },
//               {
//                 label: "Total Spent",
//                 value: `₹${budgets.reduce((a, b) => a + Number(b.spent), 0)}`,
//               },
//               {
//                 label: "Remaining",
//                 value: `₹${budgets.reduce((a, b) => a + (b.limit - b.spent), 0)}`,
//               },
//             ].map((c, i) => (
//               <div
//                 key={i}
//                 className="rounded-2xl p-6"
//                 style={{
//                   background: "rgba(255,255,255,0.02)",
//                   border: "1px solid rgba(255,255,255,0.04)",
//                   boxShadow: "0 10px 30px rgba(2,6,23,0.5)",
//                 }}
//               >
//                 <p className="text-sm text-gray-300">{c.label}</p>
//                 <h2 className="text-2xl font-semibold mt-1 text-white">{c.value}</h2>
//               </div>
//             ))}
//           </div>

//           {/* List */}
//           <h2 className="text-xl font-semibold text-white mb-5">Your Budgets</h2>

//           {budgets.length === 0 ? (
//             <div className="text-center py-20 text-gray-400">
//               No budgets yet.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
//               {budgets.map((b) => {
//                 const percentage = Math.min((b.spent / b.limit) * 100, 100);
//                 const accent = accentForCategory(b.category);

//                 return (
//                   <div
//                     key={b._id}
//                     className="relative p-6 rounded-2xl"
//                     style={{
//                       background: "rgba(255,255,255,0.02)",
//                       border: "1px solid rgba(255,255,255,0.04)",
//                       boxShadow: "0 12px 35px rgba(2,6,23,0.5)",
//                     }}
//                   >
//                     <div
//                       className="absolute left-0 top-0 h-full w-1"
//                       style={{ background: accent }}
//                     />

//                     <div className="flex justify-between">
//                       <div>
//                         <p className="text-lg font-semibold text-white capitalize">
//                           {b.category}
//                         </p>
//                         <p className="text-sm text-gray-300">{b.month}</p>
//                       </div>
//                       <button
//                         onClick={() => deleteBudget(b._id)}
//                         className="text-gray-300 hover:text-red-400 text-lg"
//                       >
//                         ✕
//                       </button>
//                     </div>

//                     <p className="text-sm text-gray-300 mt-4">
//                       Spent: <span className="text-white">₹{b.spent}</span> / ₹{b.limit}
//                     </p>

//                     <div className="w-full mt-4 h-3 rounded-full bg-gray-800 overflow-hidden">
//                       <div
//                         style={{
//                           width: `${percentage}%`,
//                           background: b.spent > b.limit
//                             ? "linear-gradient(90deg,#fb7185,#f97316)"
//                             : accent,
//                         }}
//                         className="h-full transition-all duration-700"
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }
