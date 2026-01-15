import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "../axios";
import { motion } from "framer-motion";

const fmt = (v) =>
  `₹${Number(v || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

export default function SplitwiseGroup() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);

  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/split/groups/${groupId}/expenses`);
      setGroup(res.data.group);
      setExpenses(res.data.expenses || []);
      setBalances(res.data.balances || {});
    } catch (err) {
      console.error(err);
      alert("Unable to load group. See console.");
    }
    setLoading(false);
  };

  const addExpense = async () => {
    if (!desc || !amount || !paidBy) return alert("Fill all fields");

    try {
      await axios.post(`/api/split/groups/${groupId}/expense`, {
        groupId,
        description: desc,
        amount: Number(amount),
        paidBy,
      });

      setDesc("");
      setAmount("");
      setPaidBy("");

      await loadData();
      alert("Expense added!");
    } catch (err) {
      console.error(err);
      alert("Error adding expense");
    }
  };

  useEffect(() => {
    loadData();
  }, [groupId]);

  const settlements = useMemo(() => {
    const entries = Object.entries(balances);
    let debtors = [];
    let creditors = [];

    for (const [name, bal] of entries) {
      if (bal < 0) debtors.push({ name, amount: Math.abs(bal) });
      else if (bal > 0) creditors.push({ name, amount: bal });
    }

    const result = [];
    let d = 0,
      c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];

      const settleAmount = Math.min(debtor.amount, creditor.amount);

      result.push({
        from: debtor.name,
        to: creditor.name,
        amount: settleAmount,
      });

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount === 0) d++;
      if (creditor.amount === 0) c++;
    }

    return result;
  }, [balances]);

  if (loading && !group) return <div className="p-6">Loading…</div>;
  if (!group) return <div className="p-6">Group not found</div>;

  return (
    <div className="flex min-h-screen relative">

      {/* BACKGROUND (same as Splitwise.jsx) */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1400px 800px at 20% 10%, rgba(67,56,202,0.12), transparent 14%)," +
              "radial-gradient(900px 500px at 85% 10%, rgba(220,95,255,0.06), transparent 20%)," +
              "linear-gradient(180deg,#03040a,#08030f,#060218)",
          }}
        />

        <div
          className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, rgba(124,58,237,0.22), rgba(124,58,237,0.08) 30%, transparent 60%)",
          }}
        />

        <div
          className="absolute bottom-[-300px] left-[-300px] w-[700px] h-[700px] rounded-full blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,99,132,0.07), rgba(255,200,255,0.03) 20%, transparent 60%)",
          }}
        />
      </div>

      <Sidebar />

      <div className="flex-1 relative">
        <Topbar />

        <main className="relative z-10 p-8 space-y-8 text-white">

          {/* HEADER */}
          <h1
            className="text-3xl font-extrabold"
            style={{
              background: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {group.name}
          </h1>

          <p className="text-gray-400 mb-4">
            {group.members?.length || 0} members
          </p>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* BALANCES CARD */}
            <div
              className="p-6 rounded-2xl shadow-xl"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-xl font-semibold text-black mb-3">Balances</h3>
              <ul>
                {Object.keys(balances).length === 0 ? (
                  <li className="text-gray-500">No balances yet</li>
                ) : (
                  Object.entries(balances).map(([name, bal]) => (
                    <li
                      key={name}
                      className="flex justify-between py-2 text-black"
                    >
                      <div className="font-medium">{name}</div>
                      <div className={bal >= 0 ? "text-green-600" : "text-red-500"}>
                        {fmt(bal)}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* ADD EXPENSE CARD */}
            <div
              className="md:col-span-2 p-6 rounded-2xl shadow-xl space-y-4 text-black"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-xl font-semibold">Add Expense</h3>

              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
                className="border p-3 rounded-xl w-full"
              />

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
                className="border p-3 rounded-xl w-full"
              />

              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="border p-3 rounded-xl w-full"
              >
                <option value="">Select payer</option>
                {(group.members || []).map((m) => {
                  const key = m._id || m.name;
                  return (
                    <option key={key} value={m.name}>
                      {m.name}
                    </option>
                  );
                })}
              </select>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-xl text-white"
                  style={{
                    background: "linear-gradient(90deg,#7c3aed,#4f46e5)",
                  }}
                  onClick={addExpense}
                >
                  Add Expense
                </button>

                <button
                  className="px-4 py-2 rounded-xl border"
                  onClick={loadData}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* WHO OWES WHOM */}
          <div
            className="p-6 rounded-2xl shadow-xl text-black"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 className="text-xl font-semibold mb-3">Who Owes Whom</h3>

            {settlements.length === 0 ? (
              <p className="text-gray-500">All settled up 🎉</p>
            ) : (
              <ul className="space-y-2">
                {settlements.map((s, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b pb-2 text-black"
                  >
                    <span>
                      <b>{s.from}</b> owes <b>{s.to}</b>
                    </span>
                    <span className="font-semibold text-blue-700">
                      {fmt(s.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RECENT EXPENSES */}
          <div
            className="p-6 rounded-2xl shadow-xl text-black"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 className="text-xl font-semibold mb-3">Recent Expenses</h3>

            {expenses.length === 0 ? (
              <p className="text-gray-500">No expenses yet</p>
            ) : (
              <ul className="divide-y">
                {expenses.map((ex) => (
                  <li key={ex._id} className="py-3 flex justify-between">
                    <div>
                      <div className="font-medium">{ex.description}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(ex.date).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Paid by {ex.paidBy}</div>
                      <div className="font-semibold">{fmt(ex.amount)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}


































// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import axios from "../axios";

// const fmt = (v) =>
//   `₹${Number(v || 0).toLocaleString(undefined, {
//     maximumFractionDigits: 0,
//   })}`;

// export default function SplitwiseGroup() {
//   const { groupId } = useParams();

//   const [group, setGroup] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [balances, setBalances] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Add expense fields
//   const [desc, setDesc] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paidBy, setPaidBy] = useState("");

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`/api/split/groups/${groupId}/expenses`);
//       setGroup(res.data.group);
//       setExpenses(res.data.expenses || []);
//       setBalances(res.data.balances || {});
//     } catch (err) {
//       console.error("loadData:", err);
//       alert("Unable to load group. See console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addExpense = async () => {
//     if (!desc || !amount || !paidBy) return alert("Fill all fields");

//     try {
//       await axios.post(`/api/split/groups/${groupId}/expense`, {
//         groupId,
//         description: desc,
//         amount: Number(amount),
//         paidBy,
//       });

//       setDesc("");
//       setAmount("");
//       setPaidBy("");
//       await loadData();
//       alert("Expense added!");
//     } catch (err) {
//       console.error("addExpense:", err);
//       alert("Error adding expense");
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [groupId]);

//   // ------------------------------------------------------
//   // ⭐ WHO OWES WHOM LOGIC (settlements)
//   // ------------------------------------------------------
//   const settlements = React.useMemo(() => {
//     const entries = Object.entries(balances);

//     let debtors = [];
//     let creditors = [];

//     for (const [name, bal] of entries) {
//       if (bal < 0) debtors.push({ name, amount: Math.abs(bal) });
//       else if (bal > 0) creditors.push({ name, amount: bal });
//     }

//     const result = [];

//     let d = 0,
//       c = 0;

//     while (d < debtors.length && c < creditors.length) {
//       const debtor = debtors[d];
//       const creditor = creditors[c];

//       const settleAmount = Math.min(debtor.amount, creditor.amount);

//       result.push({
//         from: debtor.name,
//         to: creditor.name,
//         amount: settleAmount,
//       });

//       debtor.amount -= settleAmount;
//       creditor.amount -= settleAmount;

//       if (debtor.amount === 0) d++;
//       if (creditor.amount === 0) c++;
//     }

//     return result;
//   }, [balances]);

//   // ------------------------------------------------------

//   if (loading && !group) return <div className="p-6">Loading…</div>;
//   if (!group) return <div className="p-6">Group not found</div>;

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col overflow-y-auto">
//         <Topbar />
//         <main className="p-8 space-y-6">
//           <div>
//             <h1 className="text-2xl font-bold">{group.name}</h1>
//             <p className="text-sm text-gray-500">
//               {group.members?.length || 0} members
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white p-4 rounded shadow">
//               <h3 className="font-semibold mb-3">Balances</h3>
//               <ul>
//                 {Object.keys(balances).length === 0 ? (
//                   <li className="text-gray-400">No balances yet</li>
//                 ) : (
//                   Object.entries(balances).map(([name, bal]) => (
//                     <li key={name} className="flex justify-between py-2">
//                       <div className="font-medium">{name}</div>
//                       <div
//                         className={
//                           bal >= 0 ? "text-green-600" : "text-red-500"
//                         }
//                       >
//                         {fmt(bal)}
//                       </div>
//                     </li>
//                   ))
//                 )}
//               </ul>
//             </div>

//             <div className="md:col-span-2 bg-white p-4 rounded shadow">
//               <h3 className="font-semibold mb-3">Add Expense</h3>

//               <input
//                 value={desc}
//                 onChange={(e) => setDesc(e.target.value)}
//                 placeholder="Description"
//                 className="border p-2 rounded w-full mb-3"
//               />

//               <input
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Amount"
//                 type="number"
//                 className="border p-2 rounded w-full mb-3"
//               />

//               <select
//                 value={paidBy}
//                 onChange={(e) => setPaidBy(e.target.value)}
//                 className="border p-2 rounded w-full mb-3"
//               >
//                 <option value="">Select payer</option>
//                 {(group.members || []).map((m) => {
//                   const key = m._id || m.name;
//                   return (
//                     <option key={key} value={m.name}>
//                       {m.name}
//                     </option>
//                   );
//                 })}
//               </select>

//               <div className="flex gap-2">
//                 <button
//                   className="bg-blue-600 text-white px-4 py-2 rounded"
//                   onClick={addExpense}
//                 >
//                   Add Expense
//                 </button>
//                 <button className="px-4 py-2 rounded border" onClick={loadData}>
//                   Refresh
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* ------------------------------------------------------ */}
//           {/* ⭐ WHO OWES WHOM UI */}
//           {/* ------------------------------------------------------ */}
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold mb-3">Who Owes Whom</h3>

//             {settlements.length === 0 ? (
//               <p className="text-gray-400">All settled up! 🎉</p>
//             ) : (
//               <ul className="space-y-2">
//                 {settlements.map((s, i) => (
//                   <li key={i} className="flex justify-between border-b pb-2">
//                     <span>
//                       <b>{s.from}</b> owes <b>{s.to}</b>
//                     </span>
//                     <span className="font-semibold text-blue-600">
//                       {fmt(s.amount)}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* ------------------------------------------------------ */}

//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold mb-3">Recent Expenses</h3>
//             {expenses.length === 0 ? (
//               <p className="text-gray-400">No expenses yet</p>
//             ) : (
//               <ul className="divide-y">
//                 {expenses.map((ex) => (
//                   <li key={ex._id} className="py-3 flex justify-between">
//                     <div>
//                       <div className="font-medium">{ex.description}</div>
//                       <div className="text-xs text-gray-500">
//                         {new Date(ex.date).toLocaleString()}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm">Paid by {ex.paidBy}</div>
//                       <div className="font-semibold">{fmt(ex.amount)}</div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
