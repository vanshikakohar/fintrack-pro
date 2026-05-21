
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { motion } from "framer-motion";
import API from "../utils/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

const COLORS = ["#60a5fa", "#10b981", "#f59e0b", "#fb923c", "#ef4444"];

// KPI white-glass mini card
const KPI = ({ bgGradient, title, value, subtitle, icon }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-2xl p-5 shadow-xl"
    style={{
      background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))",
      border: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div className="flex items-start justify-between">
      <div className="text-xs uppercase text-gray-500">{title}</div>
      <div
        className="p-2 rounded-lg"
        style={{
          background: bgGradient,
          color: "white",
          boxShadow: "0 8px 30px rgba(124,58,237,0.12)",
        }}
      >
        {icon}
      </div>
    </div>

    <div className="mt-4">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-2">{subtitle}</div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch summary from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/transactions/summary`);
        const data = await res.json();
        setSummary(data.summary || {});
        setCategories(data.categories || []);
        setTransactions(data.recentTransactions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const arr = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      arr.push({
        key,
        label: d.toLocaleString(undefined, { month: "short" }),
        income: 0,
        expense: 0,
      });
    }
    transactions.forEach((t) => {
      const d = new Date(t.date || Date.now());
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const slot = arr.find((m) => m.key === key);
      if (slot) {
        if (t.type === "income") slot.income += Number(t.amount);
        else slot.expense += Number(t.amount);
      }
    });
    return arr;
  }, [transactions]);

  // Pie data
  const pieData = categories.map((c) => ({
    category: c.category,
    amount: c.amount,
  }));

  const fmt = (v) => `₹${Number(v || 0).toLocaleString()}`;

  const uploadedTexturePath =
    "/mnt/data/A_digital_screenshot_of_a_web_application_named_%22F.png";

  return (
    <div className="flex min-h-screen relative overflow-hidden">

      {/* ---------- FULL SCREEN BACKGROUND (Fixed Right + Bottom) ---------- */}
      <div className="absolute inset-0 -z-30 overflow-hidden">

        {/* base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 10% 10%, rgba(67,56,202,0.12), transparent 12%)," +
              "radial-gradient(900px 500px at 85% 20%, rgba(220, 95, 255, 0.06), transparent 18%)," +
              "linear-gradient(180deg, #03040a 0%, #08030f 60%, #060218 100%)",
          }}
        />

        {/* nebula 1 */}
        <div
          className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, rgba(124,58,237,0.22), rgba(124,58,237,0.08) 30%, rgba(0,0,0,0) 55%)," +
              "radial-gradient(circle at 70% 60%, rgba(96,165,250,0.12), rgba(99,102,241,0.05) 30%, rgba(0,0,0,0) 55%)",
          }}
        />

        {/* nebula 2 */}
        <div
          className="absolute bottom-[-300px] left-[-300px] w-[700px] h-[700px] rounded-full blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,99,132,0.07), rgba(255,200,255,0.03) 20%, rgba(0,0,0,0) 60%)",
          }}
        />

        {/* texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${uploadedTexturePath}")`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.04,
            mixBlendMode: "overlay",
          }}
        />
      </div>
      {/* ------------------------------------------------------------------ */}

      <Sidebar />

      <div className="flex-1 relative">
        <Topbar />

        <main className="relative z-10 p-8 space-y-8 min-h-[calc(100vh-80px)]">


          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-extrabold"
                style={{
                  background: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Overview
              </h1>
              <p className="text-gray-300 mt-1">Your financial summary at a glance</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div>Last updated</div>
              <div>{new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <KPI
              bgGradient="linear-gradient(90deg,#60a5fa,#7c3aed)"
              title="Credit Card"
              value={fmt(summary.income)}
              subtitle="Total income"
              icon={<Wallet size={18} />}
            />
            <KPI
              bgGradient="linear-gradient(90deg,#10b981,#3b82f6)"
              title="Savings"
              value={fmt(summary.balance)}
              subtitle="Available balance"
              icon={<ArrowUpRight size={16} />}
            />
            <KPI
              bgGradient="linear-gradient(90deg,#f59e0b,#fb923c)"
              title="Expenses"
              value={fmt(summary.expense)}
              subtitle="Total spent"
              icon={<ArrowDownRight size={16} />}
            />
            <KPI
              bgGradient="linear-gradient(90deg,#f97316,#ef4444)"
              title="Cashback"
              value={fmt(Math.round((summary.income || 0) * 0.02))}
              subtitle="Estimated cashback"
              icon={<ArrowUpRight size={16} />}
            />
          </div>

          {/* stats tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["Total Income", summary.income, "text-gray-900"],
              ["Total Expense", summary.expense, "text-red-600"],
              ["Available Balance", summary.balance, "text-indigo-600"],
              ["Monthly Turnover", summary.income - summary.expense, "text-amber-600"],
            ].map(([title, val, color], i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                }}
              >
                <h3 className="text-sm text-gray-500">{title}</h3>
                <p className={`text-2xl font-semibold mt-1 ${color}`}>{fmt(val)}</p>
                <div className="text-xs text-gray-400 mt-1">This month</div>
              </div>
            ))}
          </div>

          {/* charts + transactions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* charts */}
            <div
              className="xl:col-span-2 rounded-2xl p-6"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
              }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Top Categories</h3>
                <span className="text-sm text-gray-500">This month</span>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* pie */}
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={2}
                        label
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* category breakdown */}
                <div>
                  <h4 className="text-sm text-gray-500">Spending Distribution</h4>
                  <p className="text-lg font-semibold mt-1">Breakdown by category</p>

                  <div className="mt-4 space-y-3">
                    {pieData.map((p, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              background: COLORS[i % COLORS.length],
                              borderRadius: 4,
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium">{p.category}</div>
                            <div className="text-xs text-gray-400">
                              {((p.amount /
                                (pieData.reduce((a, b) => a + b.amount, 0) || 1)) *
                                100
                              ).toFixed(0)}
                              %
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold">{fmt(p.amount)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm text-gray-500 mb-2">
                      Monthly Trend (last 6 months)
                    </h4>
                    <div style={{ width: "100%", height: 140 }}>
                      <ResponsiveContainer>
                        <BarChart data={monthlyTrend}>
                          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                          <YAxis hide />
                          <Tooltip formatter={(v) => fmt(v)} />
                          <Bar dataKey="expense" fill="#fb923c" stackId="a" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="income" fill="#10b981" stackId="a" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* transactions */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
              }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Last Transactions</h3>
                <span className="text-sm text-gray-500">Recent</span>
              </div>

              <ul className="divide-y mt-6">
                {loading ? (
                  <li className="py-6 text-center text-gray-400">Loading...</li>
                ) : transactions.length === 0 ? (
                  <li className="py-6 text-center text-gray-400">No recent transactions</li>
                ) : (
                  transactions.slice(0, 8).map((t, i) => (
                    <li key={i} className="py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-indigo-600 font-semibold">
                          {t.description?.[0]?.toUpperCase() || "T"}
                        </div>
                        <div>
                          <div className="font-medium">{t.description}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(t.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            t.type === "expense" ? "text-red-500" : "text-green-600"
                          }`}
                        >
                          {t.type === "expense" ? "-" : "+"}
                          {fmt(t.amount)}
                        </div>
                        <div className="text-xs text-gray-400">{t.category}</div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
