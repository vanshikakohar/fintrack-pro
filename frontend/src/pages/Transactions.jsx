
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import API from "../utils/api";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
  });
  const [insight, setInsight] = useState("Loading insights...");
  const [loading, setLoading] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  useEffect(() => {
    fetchTransactions();
    fetchInsightsSafe();
  }, []);

  /* ================= FETCH TRANSACTIONS ================= */
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      if (!user || !user._id) {
        setTransactions([]);
        return;
      }

      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API}/transactions?userId=${user._id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      let data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.transactions)
        ? res.data.transactions
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      data = data
        .filter((t) => t && t._id)
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      setTransactions(data);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH AI INSIGHT ================= */
  const fetchInsightsSafe = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/finance-ai`,
        { prompt: "Give 1 short insight about recent spending (one sentence)." },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setInsight(
        res.data?.reply ||
          res.data?.message ||
          "No insights available."
      );
    } catch {
      setInsight("AI insights unavailable 🚫");
    }
  };

  /* ================= ADD TRANSACTION ================= */
  const addTransaction = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        amount: Number(form.amount),
        userId: user?._id,
        date: new Date().toISOString(),
      };

      const res = await axios.post(
        `${API}/transactions/add`,
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      const newTransaction =
        res.data?.transaction ||
        res.data?.data ||
        res.data;

      if (!newTransaction || !newTransaction._id) {
        toast.error("Invalid transaction response");
        return;
      }

      setTransactions((prev) => [newTransaction, ...prev]);
      setForm({ type: "expense", amount: "", category: "", description: "" });
      setShowModal(false);
      toast.success("Transaction added");
    } catch (err) {
      toast.error("Failed to add transaction");
    }
  };

  /* ================= DELETE TRANSACTION ================= */
  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/transactions/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  /* ================= FILTER ================= */
  const visibleTransactions = useMemo(() => {
    const q = search.toLowerCase();

    return !q
      ? transactions
      : transactions.filter(
          (t) =>
            t &&
            (t.description?.toLowerCase().includes(q) ||
              t.category?.toLowerCase().includes(q))
        );
  }, [transactions, search]);

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#0c001b] to-[#12002e]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-8 space-y-8">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1
              className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
              }}
            >
              Transactions
            </h1>

            <div className="flex gap-3">
              <div className="bg-white px-3 py-2 rounded-md flex items-center border shadow-sm">
                <Search className="text-gray-600 mr-2" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent outline-none text-gray-800 w-56"
                />
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white flex items-center gap-2 shadow-md"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="bg-white p-4 rounded-xl shadow-lg border">
            <p className="text-gray-800 text-sm">💡 {insight}</p>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-300 text-center py-12">Loading...</p>
            ) : visibleTransactions.length === 0 ? (
              <p className="text-gray-300 text-center py-12">
                No transactions 📭
              </p>
            ) : (
              visibleTransactions
                .filter((t) => t && t._id)
                .map((t) => (
                  <div
                    key={t._id}
                    className="bg-white border rounded-xl px-5 py-4 flex justify-between items-center shadow-md hover:shadow-xl transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {t.description || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-6 items-center">
                      <span
                        className={`text-sm font-semibold ${
                          t.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}₹
                        {Number(t.amount).toLocaleString("en-IN")}
                      </span>

                      <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded border">
                        {t.category || "General"}
                      </span>

                      <button
                        onClick={() => deleteTransaction(t._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <form
            onSubmit={addTransaction}
            className="bg-white p-6 rounded-xl w-80 shadow-2xl border"
          >
            <h2 className="text-gray-900 font-semibold mb-4">
              Add Transaction
            </h2>

            <select
              className="w-full p-2 mb-3 rounded border"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              required
              type="number"
              placeholder="Amount"
              className="w-full p-2 mb-3 rounded border"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <input
              required
              placeholder="Category"
              className="w-full p-2 mb-3 rounded border"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <input
              placeholder="Description"
              className="w-full p-2 mb-4 rounded border"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-green-600 text-white rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
