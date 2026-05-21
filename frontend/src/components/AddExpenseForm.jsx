// // frontend/src/components/AddExpenseForm.jsx
// frontend/src/components/AddExpenseForm.jsx
import React, { useEffect, useState } from "react";

export default function AddExpenseForm({ members, onAdd }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState(members[0]?.name || "");

  const [participants, setParticipants] = useState(
    members.map((m) => m.name)
  );

  useEffect(() => {
    setParticipants(members.map((m) => m.name));
  }, [members]);

  const toggleParticipant = (name) => {
    if (participants.includes(name)) {
      setParticipants(participants.filter((p) => p !== name));
    } else {
      setParticipants([...participants, name]);
    }
  };

  const handleAdd = () => {
    if (!desc || !amount || !payer) return;

    if (participants.length === 0) {
      return alert("Select at least one participant");
    }

    const splitAmount = Number(amount) / participants.length;

    const splits = participants.map((name) => ({
      memberName: name,
      amount: splitAmount,
    }));

    const payload = {
      description: desc,
      amount: Number(amount),
      paidBy: payer,
      splitType: "custom",
      splits,
    };

    onAdd(payload);

    setDesc("");
    setAmount("");
    setPayer(members[0]?.name || "");
    setParticipants(members.map((m) => m.name));
  };

  return (
    <div className="space-y-4">

      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description"
        className="border p-2 rounded w-full"
      />

      <div className="flex gap-2">

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          className="border p-2 rounded w-40"
        />

        <select
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
          className="border p-2 rounded"
        >
          {members.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>

      </div>

      {/* PARTICIPANTS */}
      <div>
        <p className="font-medium mb-2">Split Between:</p>

        <div className="space-y-2">

          {members.map((m) => (
            <label
              key={m.name}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={participants.includes(m.name)}
                onChange={() => toggleParticipant(m.name)}
              />

              {m.name}
            </label>
          ))}

        </div>
      </div>

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Expense
      </button>

    </div>
  );
}
// import React, { useState } from "react";

// export default function AddExpenseForm({ members, onAdd }) {
//   const [desc, setDesc] = useState("");
//   const [amount, setAmount] = useState("");
//   const [payer, setPayer] = useState(members[0]?.name || "");
//   const [splitType, setSplitType] = useState("equal");
//   const [splits, setSplits] = useState(members.map(m=>({ memberName: m.name, amount: 0 })));

//   const handleAdd = () => {
//     if (!desc || !amount || !payer) return;
//     const payload = {
//       description: desc,
//       amount: Number(amount),
//       paidBy: payer,
//       splitType,
//       splits: splitType==="custom" ? splits : []
//     };
//     onAdd(payload);
//     setDesc(""); setAmount(""); setPayer(members[0]?.name || "");
//   };

//   return (
//     <div className="space-y-3">
//       <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="border p-2 rounded w-full" />
//       <div className="flex gap-2">
//         <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" type="number" className="border p-2 rounded w-40" />
//         <select value={payer} onChange={e=>setPayer(e.target.value)} className="border p-2 rounded">
//           {members.map(m=> <option key={m.name} value={m.name}>{m.name}</option>)}
//         </select>
//         <select value={splitType} onChange={e=>setSplitType(e.target.value)} className="border p-2 rounded">
//           <option value="equal">Equal</option>
//           <option value="percent">By percent (UI not implemented)</option>
//           <option value="custom">Custom</option>
//         </select>
//       </div>

//       {splitType==="custom" && (
//         <div className="space-y-2">
//           {splits.map((s, idx) => (
//             <div key={idx} className="flex gap-2 items-center">
//               <div className="w-32">{s.memberName}</div>
//               <input type="number" value={s.amount} onChange={e => {
//                 const arr = [...splits]; arr[idx].amount = Number(e.target.value || 0); setSplits(arr);
//               }} className="border p-2 rounded w-32" />
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="flex gap-2">
//         <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add Expense</button>
//       </div>
//     </div>
//   );
// }
