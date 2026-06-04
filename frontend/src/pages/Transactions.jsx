// import React, { useEffect, useMemo, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import axios from "axios";
// import API from "../utils/api";

// import {
//   Plus,
//   Search,
//   Trash2,
//   ArrowUpRight,
//   ArrowDownRight,
//   Wallet,
//   Calendar,
//   MoreHorizontal,
//   TrendingUp,
// } from "lucide-react";

// import { motion } from "framer-motion";
// import { toast } from "sonner";

// const formatCurrency = (amount) =>
//   `₹${Number(amount || 0).toLocaleString("en-IN")}`;

// export default function Transactions() {
//   const [transactions, setTransactions] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [form, setForm] = useState({
//     type: "expense",
//     amount: "",
//     category: "",
//     description: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const user =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("user") || "null")
//       : null;

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   /* ================= FETCH ================= */

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${API}/transactions?userId=${user?._id}`,
//         {
//           headers: token
//             ? { Authorization: `Bearer ${token}` }
//             : {},
//         }
//       );

//       let data = Array.isArray(res.data)
//         ? res.data
//         : res.data.transactions || [];

//       data = data.sort(
//         (a, b) =>
//           new Date(b.date) - new Date(a.date)
//       );

//       setTransactions(data);

//     } catch {
//       toast.error("Failed to load transactions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= ADD ================= */

//   const addTransaction = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem("token");

//       const payload = {
//         ...form,
//         amount: Number(form.amount),
//         userId: user?._id,
//         date: new Date().toISOString(),
//       };

//       const res = await axios.post(
//         `${API}/transactions/add`,
//         payload,
//         {
//           headers: token
//             ? { Authorization: `Bearer ${token}` }
//             : {},
//         }
//       );

//       setTransactions((prev) => [
//         res.data,
//         ...prev,
//       ]);

//       setShowModal(false);

//       setForm({
//         type: "expense",
//         amount: "",
//         category: "",
//         description: "",
//       });

//       toast.success("Transaction added");

//     } catch {
//       toast.error("Failed to add transaction");
//     }
//   };

//   /* ================= DELETE ================= */

//   const deleteTransaction = async (id) => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.delete(
//         `${API}/transactions/${id}`,
//         {
//           headers: token
//             ? { Authorization: `Bearer ${token}` }
//             : {},
//         }
//       );

//       setTransactions((prev) =>
//         prev.filter((t) => t._id !== id)
//       );

//       toast.success("Deleted");

//     } catch {
//       toast.error("Failed to delete");
//     }
//   };

//   /* ================= FILTER ================= */

//   const filtered = useMemo(() => {
//     if (!search) return transactions;

//     return transactions.filter(
//       (t) =>
//         t.description
//           ?.toLowerCase()
//           .includes(search.toLowerCase()) ||
//         t.category
//           ?.toLowerCase()
//           .includes(search.toLowerCase())
//     );
//   }, [transactions, search]);

//   /* ================= STATS ================= */

//   const income = transactions
//     .filter((t) => t.type === "income")
//     .reduce((a, b) => a + Number(b.amount), 0);

//   const expense = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((a, b) => a + Number(b.amount), 0);

//   const balance = income - expense;

//   return (
//     <div
//       className="
//         flex min-h-screen text-white overflow-hidden
//         bg-[#030712]
//       "
//       style={{
//         backgroundImage: `
//           radial-gradient(circle at top left, rgba(139,92,246,0.18), transparent 22%),
//           radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 25%),
//           radial-gradient(circle at bottom, rgba(168,85,247,0.08), transparent 25%)
//         `,
//       }}
//     >
//       <Sidebar />

//       <div className="flex-1 flex flex-col overflow-hidden">

//         <Topbar />

//         <main className="p-8 overflow-y-auto">

//           {/* HERO */}

//           <div className="flex items-start justify-between mb-10">

//             <div>

//               <h1
//                 className="
//                   text-6xl font-black tracking-tight
//                   bg-gradient-to-r
//                   from-fuchsia-500
//                   via-violet-400
//                   to-blue-400
//                   bg-clip-text text-transparent
//                 "
//               >
//                 Transactions
//               </h1>

//               <p className="text-gray-400 mt-3 text-lg">
//                 Track, analyze and manage your money beautifully.
//               </p>

//             </div>

//             <motion.button
//               whileHover={{ scale: 1.04 }}
//               whileTap={{ scale: 0.96 }}
//               onClick={() => setShowModal(true)}
//               className="
//                 px-7 py-4 rounded-3xl
//                 bg-gradient-to-r from-violet-600 to-blue-500
//                 text-white font-semibold
//                 shadow-[0_0_40px_rgba(139,92,246,0.45)]
//                 flex items-center gap-3
//               "
//             >
//               <Plus size={20} />
//               Add Transaction
//             </motion.button>

//           </div>

//           {/* STATS */}

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

//             <GlassCard>
//               <div className="flex justify-between items-start">

//                 <div>
//                   <p className="text-emerald-400 font-medium">
//                     Total Income
//                   </p>

//                   <h2 className="text-5xl font-black mt-4">
//                     {formatCurrency(income)}
//                   </h2>

//                   <p className="text-emerald-400 mt-4 text-sm">
//                     +18.2%
//                     <span className="text-gray-500 ml-2">
//                       vs last month
//                     </span>
//                   </p>
//                 </div>

//                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
//                   <ArrowUpRight className="text-emerald-400" />
//                 </div>

//               </div>
//             </GlassCard>

//             <GlassCard>
//               <div className="flex justify-between items-start">

//                 <div>
//                   <p className="text-rose-400 font-medium">
//                     Total Expenses
//                   </p>

//                   <h2 className="text-5xl font-black mt-4">
//                     {formatCurrency(expense)}
//                   </h2>

//                   <p className="text-rose-400 mt-4 text-sm">
//                     -8.7%
//                     <span className="text-gray-500 ml-2">
//                       vs last month
//                     </span>
//                   </p>
//                 </div>

//                 <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center">
//                   <ArrowDownRight className="text-rose-400" />
//                 </div>

//               </div>
//             </GlassCard>

//             <GlassCard>
//               <div className="flex justify-between items-start">

//                 <div>
//                   <p className="text-violet-400 font-medium">
//                     Net Balance
//                   </p>

//                   <h2 className="text-5xl font-black mt-4">
//                     {formatCurrency(balance)}
//                   </h2>

//                   <p className="text-emerald-400 mt-4 text-sm">
//                     +12.4%
//                     <span className="text-gray-500 ml-2">
//                       vs last month
//                     </span>
//                   </p>
//                 </div>

//                 <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center">
//                   <Wallet className="text-violet-400" />
//                 </div>

//               </div>
//             </GlassCard>

//             <GlassCard>
//               <div className="flex justify-between items-start">

//                 <div>
//                   <p className="text-blue-400 font-medium">
//                     This Month
//                   </p>

//                   <h2 className="text-5xl font-black mt-4">
//                     {formatCurrency(balance)}
//                   </h2>

//                   <p className="text-gray-400 mt-4 text-sm">
//                     {transactions.length} Transactions
//                   </p>
//                 </div>

//                 <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
//                   <Calendar className="text-blue-400" />
//                 </div>

//               </div>
//             </GlassCard>

//           </div>

//           {/* CONTENT */}

//           <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">

//             {/* LEFT */}

//             <div
//               className="
//                 rounded-[34px]
//                 border border-white/10
//                 bg-white/[0.04]
//                 backdrop-blur-2xl
//                 p-6
//               "
//             >

//               {/* SEARCH */}

//               <div className="flex gap-4 mb-8">

//                 <div
//                   className="
//                     flex-1 flex items-center gap-3
//                     bg-black/20 border border-white/10
//                     rounded-2xl px-5 py-4
//                   "
//                 >
//                   <Search size={18} className="text-gray-500" />

//                   <input
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder="Search transactions..."
//                     className="
//                       bg-transparent flex-1 outline-none
//                       text-white placeholder:text-gray-500
//                     "
//                   />
//                 </div>

//               </div>

//               {/* TABLE */}

//               <div>

//                 <h2 className="text-2xl font-bold mb-6">
//                   Recent Transactions
//                 </h2>

//                 <div className="space-y-4">

//                   {loading ? (
//                     <div className="text-gray-400">
//                       Loading...
//                     </div>
//                   ) : filtered.length === 0 ? (
//                     <div className="text-gray-500 py-12 text-center">
//                       No transactions found.
//                     </div>
//                   ) : (
//                     filtered.map((t, i) => (
//                       <motion.div
//                         key={t._id}
//                         initial={{ opacity: 0, y: 15 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: i * 0.03 }}

//                         whileHover={{
//                           scale: 1.01,
//                         }}

//                         className="
//                           rounded-3xl
//                           border border-white/8
//                           bg-white/[0.03]
//                           p-5
//                           flex items-center justify-between
//                           hover:bg-white/[0.05]
//                           transition-all
//                         "
//                       >

//                         <div className="flex items-center gap-5">

//                           <div
//                             className={`
//                               w-16 h-16 rounded-2xl
//                               flex items-center justify-center
//                               ${
//                                 t.type === "income"
//                                   ? "bg-emerald-500/20"
//                                   : "bg-rose-500/20"
//                               }
//                             `}
//                           >
//                             {t.type === "income" ? (
//                               <ArrowUpRight className="text-emerald-400" />
//                             ) : (
//                               <ArrowDownRight className="text-rose-400" />
//                             )}
//                           </div>

//                           <div>

//                             <h3 className="text-xl font-semibold">
//                               {t.description || "Untitled"}
//                             </h3>

//                             <div className="flex items-center gap-3 mt-2">

//                               <span className="text-gray-400 text-sm">
//                                 {t.type}
//                               </span>

//                               <span className="w-1 h-1 rounded-full bg-gray-600" />

//                               <span className="text-gray-500 text-sm">
//                                 {t.category}
//                               </span>

//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-10">

//                           <div className="text-right">

//                             <p className="text-gray-400 text-sm">
//                               {new Date(
//                                 t.date
//                               ).toLocaleDateString()}
//                             </p>

//                             <h2
//                               className={`
//                                 text-2xl font-bold mt-1
//                                 ${
//                                   t.type === "income"
//                                     ? "text-emerald-400"
//                                     : "text-rose-400"
//                                 }
//                               `}
//                             >
//                               {t.type === "income"
//                                 ? "+"
//                                 : "-"}
//                               {formatCurrency(t.amount)}
//                             </h2>

//                           </div>

//                           <button
//                             onClick={() =>
//                               deleteTransaction(t._id)
//                             }
//                             className="
//                               w-11 h-11 rounded-xl
//                               hover:bg-red-500/10
//                               flex items-center justify-center
//                               transition
//                             "
//                           >
//                             <Trash2
//                               size={18}
//                               className="text-gray-500 hover:text-red-400"
//                             />
//                           </button>

//                           <button className="text-gray-500">
//                             <MoreHorizontal size={20} />
//                           </button>

//                         </div>
//                       </motion.div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT PANEL */}

//             <div className="space-y-8">

//               <GlassCard>

//                 <div className="flex items-center justify-between mb-8">

//                   <h2 className="text-2xl font-bold">
//                     Spending Overview
//                   </h2>

//                   <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-400">
//                     This Month
//                   </div>

//                 </div>

//                 <div className="flex justify-center">

//                   <div
//                     className="
//                       w-56 h-56 rounded-full
//                       border-[18px]
//                       border-violet-500
//                       relative
//                     "
//                     style={{
//                       borderTopColor: "#3B82F6",
//                       borderRightColor: "#8B5CF6",
//                       borderBottomColor: "#EC4899",
//                       borderLeftColor: "#F59E0B",
//                     }}
//                   >

//                     <div className="absolute inset-0 flex flex-col items-center justify-center">

//                       <h2 className="text-3xl font-black">
//                         {formatCurrency(expense)}
//                       </h2>

//                       <p className="text-gray-400 mt-1">
//                         Total
//                       </p>

//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8 space-y-4">

//                   <CategoryRow
//                     color="bg-violet-500"
//                     title="Shopping"
//                     value="40.4%"
//                   />

//                   <CategoryRow
//                     color="bg-pink-500"
//                     title="Food"
//                     value="20.6%"
//                   />

//                   <CategoryRow
//                     color="bg-yellow-500"
//                     title="Bills"
//                     value="18.5%"
//                   />

//                   <CategoryRow
//                     color="bg-blue-500"
//                     title="Transport"
//                     value="12.4%"
//                   />

//                 </div>

//               </GlassCard>

//               <GlassCard>

//                 <div className="flex items-center gap-3 mb-6">

//                   <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
//                     <TrendingUp className="text-violet-400" />
//                   </div>

//                   <div>

//                     <h3 className="text-xl font-bold">
//                       Financial Tip
//                     </h3>

//                     <p className="text-gray-500 text-sm">
//                       Smart spending insight
//                     </p>

//                   </div>
//                 </div>

//                 <p className="text-2xl leading-relaxed text-gray-300">
//                   You've saved
//                   <span className="text-emerald-400 font-bold mx-2">
//                     ₹3,200
//                   </span>
//                   more than last month.
//                   Keep it up 🚀
//                 </p>

//               </GlassCard>

//             </div>
//           </div>
//         </main>
//       </div>

//       {/* MODAL */}

//       {showModal && (
//         <div
//           className="
//             fixed inset-0 z-50
//             bg-black/60 backdrop-blur-md
//             flex items-center justify-center
//           "
//         >

//           <motion.form
//             initial={{
//               opacity: 0,
//               scale: 0.92,
//             }}
//             animate={{
//               opacity: 1,
//               scale: 1,
//             }}

//             onSubmit={addTransaction}

//             className="
//               w-[450px]
//               rounded-[36px]
//               border border-white/10
//               bg-[#0B1120]
//               p-8
//               shadow-2xl
//             "
//           >

//             <h2 className="text-3xl font-black mb-8">
//               Add Transaction
//             </h2>

//             <div className="space-y-5">

//               <select
//                 value={form.type}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     type: e.target.value,
//                   })
//                 }
//                 className="
//                   w-full bg-white/5 border border-white/10
//                   rounded-2xl p-4 text-white outline-none
//                 "
//               >
//                 <option value="expense">
//                   Expense
//                 </option>

//                 <option value="income">
//                   Income
//                 </option>
//               </select>

//               <input
//                 type="number"
//                 placeholder="Amount"
//                 required
//                 value={form.amount}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     amount: e.target.value,
//                   })
//                 }
//                 className="
//                   w-full bg-white/5 border border-white/10
//                   rounded-2xl p-4 text-white outline-none
//                 "
//               />

//               <input
//                 placeholder="Category"
//                 required
//                 value={form.category}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     category: e.target.value,
//                   })
//                 }
//                 className="
//                   w-full bg-white/5 border border-white/10
//                   rounded-2xl p-4 text-white outline-none
//                 "
//               />

//               <input
//                 placeholder="Description"
//                 value={form.description}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     description: e.target.value,
//                   })
//                 }
//                 className="
//                   w-full bg-white/5 border border-white/10
//                   rounded-2xl p-4 text-white outline-none
//                 "
//               />

//             </div>

//             <div className="flex gap-4 mt-8">

//               <button
//                 type="submit"
//                 className="
//                   flex-1 py-4 rounded-2xl
//                   bg-gradient-to-r from-violet-600 to-blue-500
//                   text-white font-semibold
//                 "
//               >
//                 Save
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowModal(false)
//                 }
//                 className="
//                   flex-1 py-4 rounded-2xl
//                   bg-white/10
//                   text-white
//                 "
//               >
//                 Cancel
//               </button>

//             </div>
//           </motion.form>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= GLASS CARD ================= */

// function GlassCard({ children }) {
//   return (
//     <motion.div
//       whileHover={{
//         y: -5,
//       }}

//       className="
//         rounded-[32px]
//         border border-white/10
//         bg-white/[0.04]
//         backdrop-blur-2xl
//         p-6
//       "
//     >
//       {children}
//     </motion.div>
//   );
// }

// /* ================= CATEGORY ================= */

// function CategoryRow({
//   color,
//   title,
//   value,
// }) {
//   return (
//     <div className="flex items-center justify-between">

//       <div className="flex items-center gap-3">

//         <div
//           className={`w-3 h-3 rounded-full ${color}`}
//         />

//         <span className="text-gray-300">
//           {title}
//         </span>

//       </div>

//       <span className="text-gray-500">
//         {value}
//       </span>

//     </div>
//   );
// }










import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import API from "../utils/api";

import {
  Plus,
  Search,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "sonner";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    accountId: "",
  });

  const [loading, setLoading] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  /* ================= FETCH ACCOUNTS ================= */

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        `${API}/accounts?userId=${user?._id}`
      );

      setAccounts(res.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH TRANSACTIONS ================= */

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/transactions?userId=${user?._id}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      let data = Array.isArray(res.data)
        ? res.data
        : res.data.transactions || [];

      data = data.sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );

      setTransactions(data);

    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD TRANSACTION ================= */

 const addTransaction = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    // OPTIONAL ACCOUNT



    // CREATE TRANSACTION
    const payload = {
      userId: user?._id,
      accountId: form.accountId || null,
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      description: form.description,
      date: new Date().toISOString(),
    };

    const res = await axios.post(
      `${API}/transactions/add`,
      payload,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    await fetchAccounts();
await fetchTransactions();

    setShowModal(false);

    setForm({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      accountId: "",
    });

    toast.success("Transaction added");

  } catch (err) {
    console.log(err);

    toast.error("Failed to add transaction");
  }
};

  /* ================= DELETE ================= */

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API}/transactions/${id}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setTransactions((prev) =>
        prev.filter((t) => t._id !== id)
      );

      toast.success("Deleted");

    } catch {
      toast.error("Failed to delete");
    }
  };

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    if (!search) return transactions;

    return transactions.filter(
      (t) =>
        t.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        t.category
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [transactions, search]);

  /* ================= STATS ================= */

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expense;

  return (
    <div
      className="
        flex min-h-screen text-white overflow-hidden
        bg-[#030712]
      "
    >
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Topbar />

        <main className="p-8 overflow-y-auto">

          {/* HERO */}

          <div className="flex items-start justify-between mb-10">

            <div>

              <h1
                className="
                  text-6xl font-black tracking-tight
                  bg-gradient-to-r
                  from-fuchsia-500
                  via-violet-400
                  to-blue-400
                  bg-clip-text text-transparent
                "
              >
                Transactions
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Track, analyze and manage your money beautifully.
              </p>

            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowModal(true)}
              className="
                px-7 py-4 rounded-3xl
                bg-gradient-to-r from-violet-600 to-blue-500
                text-white font-semibold
                shadow-[0_0_40px_rgba(139,92,246,0.45)]
                flex items-center gap-3
              "
            >
              <Plus size={20} />
              Add Transaction
            </motion.button>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

            <GlassCard>
              <div className="flex justify-between items-start">

                <div>
                  <p className="text-emerald-400 font-medium">
                    Total Income
                  </p>

                  <h2 className="text-5xl font-black mt-4">
                    {formatCurrency(income)}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <ArrowUpRight className="text-emerald-400" />
                </div>

              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex justify-between items-start">

                <div>
                  <p className="text-rose-400 font-medium">
                    Total Expenses
                  </p>

                  <h2 className="text-5xl font-black mt-4">
                    {formatCurrency(expense)}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                  <ArrowDownRight className="text-rose-400" />
                </div>

              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex justify-between items-start">

                <div>
                  <p className="text-violet-400 font-medium">
                    Net Balance
                  </p>

                  <h2 className="text-5xl font-black mt-4">
                    {formatCurrency(balance)}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <Wallet className="text-violet-400" />
                </div>

              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex justify-between items-start">

                <div>
                  <p className="text-blue-400 font-medium">
                    This Month
                  </p>

                  <h2 className="text-5xl font-black mt-4">
                    {transactions.length}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="text-blue-400" />
                </div>

              </div>
            </GlassCard>

          </div>

          {/* CONTENT */}

          <div
            className="
              rounded-[34px]
              border border-white/10
              bg-white/[0.04]
              backdrop-blur-2xl
              p-6
            "
          >

            {/* SEARCH */}

            <div className="flex gap-4 mb-8">

              <div
                className="
                  flex-1 flex items-center gap-3
                  bg-black/20 border border-white/10
                  rounded-2xl px-5 py-4
                "
              >
                <Search
                  size={18}
                  className="text-gray-500"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search transactions..."
                  className="
                    bg-transparent flex-1 outline-none
                    text-white placeholder:text-gray-500
                  "
                />
              </div>

            </div>

            {/* TABLE */}

            <div>

              <h2 className="text-2xl font-bold mb-6">
                Recent Transactions
              </h2>

              <div className="space-y-4">

                {loading ? (
                  <div className="text-gray-400">
                    Loading...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-gray-500 py-12 text-center">
                    No transactions found.
                  </div>
                ) : (
                  filtered.map((t, i) => (

                    <motion.div
                      key={t._id}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: i * 0.03,
                      }}

                      className="
                        rounded-3xl
                        border border-white/8
                        bg-white/[0.03]
                        p-5
                        flex items-center justify-between
                      "
                    >

                      <div className="flex items-center gap-5">

                        <div
                          className={`
                            w-16 h-16 rounded-2xl
                            flex items-center justify-center
                            ${
                              t.type === "income"
                                ? "bg-emerald-500/20"
                                : "bg-rose-500/20"
                            }
                          `}
                        >
                          {t.type === "income" ? (
                            <ArrowUpRight className="text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="text-rose-400" />
                          )}
                        </div>

                        <div>

                          <h3 className="text-xl font-semibold">
                            {t.description || "Untitled"}
                          </h3>

                          <div className="flex items-center gap-3 mt-2">

                            <span className="text-gray-400 text-sm">
                              {t.type}
                            </span>

                            <span className="w-1 h-1 rounded-full bg-gray-600" />

                            <span className="text-gray-500 text-sm capitalize">
                              {t.category}
                            </span>

                            {t.accountId && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />

                                <span className="text-violet-400 text-sm">
                                  {accounts.find(
  (a) =>
    a._id === t.accountId
)?.bankName || "Account"}
                                </span>
                              </>
                            )}

                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-10">

                        <div className="text-right">

                          <p className="text-gray-400 text-sm">
                            {new Date(
                              t.date
                            ).toLocaleDateString()}
                          </p>

                          <h2
                            className={`
                              text-2xl font-bold mt-1
                              ${
                                t.type === "income"
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }
                            `}
                          >
                            {t.type === "income"
                              ? "+"
                              : "-"}

                            {formatCurrency(t.amount)}
                          </h2>

                        </div>

                        <button
                          onClick={() =>
                            deleteTransaction(t._id)
                          }
                          className="
                            w-11 h-11 rounded-xl
                            hover:bg-red-500/10
                            flex items-center justify-center
                          "
                        >
                          <Trash2
                            size={18}
                            className="text-gray-500 hover:text-red-400"
                          />
                        </button>

                      </div>

                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL */}

      {showModal && (
        <div
          className="
            fixed inset-0 z-50
            bg-black/60 backdrop-blur-md
            flex items-center justify-center
          "
        >

          <motion.form
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}

            onSubmit={addTransaction}

            className="
              w-[450px]
              rounded-[36px]
              border border-white/10
              bg-[#0B1120]
              p-8
              shadow-2xl
            "
          >

            <h2 className="text-3xl font-black mb-8">
              Add Transaction
            </h2>

            <div className="space-y-5">

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
                className="
                  w-full bg-white/5 border border-white/10
                  rounded-2xl p-4 text-white outline-none
                "
              >
                <option value="expense">
                  Expense
                </option>

                <option value="income">
                  Income
                </option>
              </select>

             {/* ACCOUNT SELECT */}

<select
  value={form.accountId}
  onChange={(e) =>
    setForm({
      ...form,
      accountId: e.target.value,
    })
  }
  className="
    w-full bg-white/5 border border-white/10
    rounded-2xl p-4 text-white outline-none
  "
>
  <option value="">
    No Account (Optional)
  </option>

  {accounts.map((acc) => (
    <option
      key={acc._id}
      value={acc._id}
      className="bg-[#0B1120]"
    >
      {acc.bankName} • ₹
{Number(acc.balance || 0).toLocaleString(
  "en-IN"
)}
    </option>
  ))}
</select>

              <input
                type="number"
                placeholder="Amount"
                required
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
                className="
                  w-full bg-white/5 border border-white/10
                  rounded-2xl p-4 text-white outline-none
                "
              />

              <input
                placeholder="Category"
                required
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                className="
                  w-full bg-white/5 border border-white/10
                  rounded-2xl p-4 text-white outline-none
                "
              />

              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="
                  w-full bg-white/5 border border-white/10
                  rounded-2xl p-4 text-white outline-none
                "
              />

            </div>

            <div className="flex gap-4 mt-8">

              <button
                type="submit"
                className="
                  flex-1 py-4 rounded-2xl
                  bg-gradient-to-r from-violet-600 to-blue-500
                  text-white font-semibold
                "
              >
                Save
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  flex-1 py-4 rounded-2xl
                  bg-white/10
                  text-white
                "
              >
                Cancel
              </button>

            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}

/* ================= GLASS CARD ================= */

function GlassCard({ children }) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}

      className="
        rounded-[32px]
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        p-6
      "
    >
      {children}
    </motion.div>
  );
}