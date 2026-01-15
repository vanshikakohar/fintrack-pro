// frontend/src/pages/GroupDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "../axios";
import AddExpenseForm from "../components/AddExpenseForm";
import { formatRupee } from "../utils/splitUtils";

export default function GroupDetail() {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);

  const fetch = async () => {
    const res = await axios.get(`/api/split/groups/${id}/expenses`);
    setGroupData(res.data);
  };

  useEffect(()=>{ fetch(); }, [id]);

  const handleAddExpense = async (payload) => {
    await axios.post(`/api/split/groups/${id}/expense`, { ...payload, groupId: id });
    await fetch();
  };

  if (!groupData) return <div className="flex h-screen"><Sidebar /><div className="flex-1"><Topbar /><main className="p-8">Loading...</main></div></div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar />
        <main className="p-8">
          <h1 className="text-2xl font-bold">{groupData.group.name}</h1>
          <p className="text-sm text-gray-500">{groupData.group.members?.length || 0} members</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Balances</h3>
              <ul className="mt-3">
                {Object.entries(groupData.balances).map(([name, bal]) => (
                  <li key={name} className="flex justify-between py-2">
                    <div>{name}</div>
                    <div className={`${bal < 0 ? "text-red-500" : "text-green-600"}`}>{formatRupee(bal)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Add Expense</h3>
              <AddExpenseForm members={groupData.group.members || []} onAdd={handleAddExpense} />
            </div>
          </div>

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Recent Expenses</h3>
            <ul className="divide-y mt-3">
              {groupData.expenses.map(e => (
                <li key={e._id} className="py-2 flex justify-between">
                  <div>
                    <div className="font-medium">{e.description}</div>
                    <div className="text-xs text-gray-500">{new Date(e.date).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div>Paid by {e.paidBy}</div>
                    <div className="font-semibold">{formatRupee(e.amount)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </main>
      </div>
    </div>
  );
}
