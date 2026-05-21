import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Toaster, toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

/**
 * Analytics page — Dashboard-styled UI + unique analytics features:
 *  - Spending Heatmap (daily)
 *  - Category Trend Lines (top categories)
 *  - AI Insights box (via /api/finance-ai)
 *  - Category comparison table (this month vs last month)
 *
 * Uses same background texture as Dashboard:
 * /mnt/data/A_digital_screenshot_of_a_web_application_named_%22F.png
 */

export default function Analytics() {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, savings: 0 });
  const [monthlyData, setMonthlyData] = useState([]); // monthly overview from analytics API
  const [filteredData, setFilteredData] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [transactions, setTransactions] = useState([]); // raw transactions for heatmap & category trends
  const [aiInsight, setAiInsight] = useState("Loading insights...");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // texture path (dashboard)
  const uploadedTexturePath =
    "/mnt/data/A_digital_screenshot_of_a_web_application_named_%22F.png";

  // ------------- Fetch analytics summary & monthly overview -------------
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/analytics`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user?._id },
      });
      const data = res.data || {};
      setSummary({
        income: data.totalIncome || 0,
        expenses: data.totalExpenses || 0,
        savings: (data.totalIncome || 0) - (data.totalExpenses || 0),
      });
      setMonthlyData(data.monthlyOverview || []);
      setFilteredData(data.monthlyOverview || []);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  // ------------- Fetch transactions (for heatmap & category trends) -------------
  const fetchTransactions = async () => {
    if (!user || !user._id) return;
    try {
      const res = await axios.get(`${API}/transactions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user._id, limit: 1000 }, // fetch many to compute heatmap & trends
      });
      // response shape might vary; try to find array
      const tdata = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.transactions)
        ? res.data.transactions
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      // ensure amounts are numbers and dates are Date
      const normalized = tdata.map((t) => ({
        ...t,
        amount: Number(t.amount || 0),
        date: t.date ? new Date(t.date) : new Date(),
        category: t.category || "General",
        type: t.type || (t.amount >= 0 ? "income" : "expense"),
      }));
      setTransactions(normalized);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  // ------------- AI insight (short) -------------
  const fetchAiInsight = async () => {
    try {
      if (!user || !user._id) {
        setAiInsight("AI insights unavailable — log in.");
        return;
      }
      const res = await axios.post(
        '${API}/finance-ai',
        { prompt: "Give 2 short insights about recent spending (2 sentences)." },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setAiInsight(res.data?.reply || res.data?.message || "No insights available.");
    } catch (err) {
      setAiInsight("AI insights unavailable 🚫");
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchTransactions();
    fetchAiInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------- Filter handler -------------
  const handleFilter = () => {
    if (!filterMonth) {
      setFilteredData(monthlyData);
      return;
    }
    const filtered = monthlyData.filter((d) =>
      (d.month || "").toLowerCase().includes(filterMonth.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleExport = () => {
    toast.success("📊 Report exported successfully!");
    // keep placeholder (no change requested)
  };

  // ---------------- Heatmap: compute daily spending for selected month -------------
  // choose the month to display: if filterMonth provided and matches a monthlyData entry, use it; else use latest month in monthlyData
  const selectedMonthKey = useMemo(() => {
    if (filterMonth) {
      const find = monthlyData.find((m) =>
        (m.month || "").toLowerCase().includes(filterMonth.toLowerCase())
      );
      if (find) return find.month; // month label like "Nov"
    }
    return monthlyData.length ? monthlyData[monthlyData.length - 1].month : null;
  }, [filterMonth, monthlyData]);

  const heatmapData = useMemo(() => {
    // build daily totals for selected month from transactions
    if (!selectedMonthKey || transactions.length === 0) return [];
    // attempt to parse a month label (like "Nov") to month index and year by finding one transaction in that label
    // Better: find first transaction whose month label matches selectedMonthKey and take its year/month
    const sample = transactions.find(
      (t) => new Date(t.date).toLocaleString(undefined, { month: "short" }) === selectedMonthKey
    );
    // fallback to current month
    const sampleDate = sample ? new Date(sample.date) : new Date();
    const year = sampleDate.getFullYear();
    const monthIndex = sampleDate.getMonth(); // 0-based
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      total: 0,
    }));

    transactions.forEach((t) => {
      const dt = new Date(t.date);
      if (dt.getFullYear() === year && dt.getMonth() === monthIndex) {
        // count expenses only (positive spending)
        const amt = t.type === "expense" ? Number(t.amount || 0) : 0;
        days[dt.getDate() - 1].total += amt;
      }
    });

    // compute max for intensity scale
    const max = Math.max(...days.map((d) => d.total), 1);
    return days.map((d) => ({ ...d, intensity: d.total / max }));
  }, [selectedMonthKey, transactions]);

  // ---------------- Category trends: compute monthly totals per category for last 6 months -------------
  const categoryTrends = useMemo(() => {
    if (!transactions || transactions.length === 0) return { months: [], series: {} };

    // create last 6 months keys (label like "Nov", "Oct") with year
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ label: d.toLocaleString(undefined, { month: "short" }), year: d.getFullYear(), month: d.getMonth() });
    }

    // categories map -> for each month sum expense by category
    const series = {}; // category -> [{monthLabel, value}, ...]
    transactions.forEach((t) => {
      const dt = new Date(t.date);
      // find month slot
      const slot = months.find((m) => m.year === dt.getFullYear() && m.month === dt.getMonth());
      if (!slot) return;
      // Only expense categories for trend
      if (t.type !== "expense") return;
      const cat = (t.category || "General").trim();
      if (!series[cat]) series[cat] = months.map((m) => ({ label: m.label, value: 0 }));
      const idx = months.findIndex((m) => m.year === dt.getFullYear() && m.month === dt.getMonth());
      if (idx >= 0) series[cat][idx].value += Number(t.amount || 0);
    });

    // convert series into array of objects per month for line chart: each object {label, CatA:val, CatB:val, ...}
    const topCategories = Object.keys(series)
      .map((k) => ({ k, total: series[k].reduce((s, x) => s + x.value, 0) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4) // top 4 categories
      .map((x) => x.k);

    const monthsLabels = months.map((m) => m.label);
    const chartData = monthsLabels.map((label, idx) => {
      const obj = { month: label };
      topCategories.forEach((cat) => {
        obj[cat] = series[cat] ? series[cat][idx].value : 0;
      });
      return obj;
    });

    return { months: monthsLabels, chartData, topCategories };
  }, [transactions]);

  // ---------------- Category comparison (this month vs last month) -------------
  const categoryComparison = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totals = {}; // cat -> {this:0, last:0}
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      const dt = new Date(t.date);
      const cat = (t.category || "General").trim();
      if (!totals[cat]) totals[cat] = { this: 0, last: 0, total: 0 };
      const isThis = dt.getFullYear() === thisMonth.getFullYear() && dt.getMonth() === thisMonth.getMonth();
      const isLast = dt.getFullYear() === lastMonth.getFullYear() && dt.getMonth() === lastMonth.getMonth();
      if (isThis) totals[cat].this += Number(t.amount || 0);
      if (isLast) totals[cat].last += Number(t.amount || 0);
      totals[cat].total += Number(t.amount || 0);
    });

    // build array sorted by this-month spending
    return Object.keys(totals)
      .map((cat) => {
        const obj = totals[cat];
        const change = obj.last === 0 ? (obj.this === 0 ? 0 : 100) : ((obj.this - obj.last) / obj.last) * 100;
        return { category: cat, thisMonth: obj.this, lastMonth: obj.last, change };
      })
      .sort((a, b) => b.thisMonth - a.thisMonth)
      .slice(0, 10);
  }, [transactions]);

  // small formatter
  const fmt = (v) => `₹${Number(v || 0).toLocaleString()}`;

  // color for heatmap intensity
  const heatColor = (intensity) => {
    // intensity 0..1 ; map to soft pink -> purple -> teal
    if (intensity <= 0) return "#111217"; // empty dark cell
    // interpolate from light pink to purple to teal
    if (intensity < 0.5) {
      // pink -> purple
      return `rgba(251,113,133,${0.35 + intensity * 1.3})`;
    } else {
      // purple -> teal
      return `rgba(124,58,237,${0.35 + (intensity - 0.5) * 1.3})`;
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background (match Dashboard) */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 10% 10%, rgba(67,56,202,0.12), transparent 12%)," +
              "radial-gradient(900px 500px at 85% 20%, rgba(220, 95, 255, 0.06), transparent 18%)," +
              "linear-gradient(180deg, #03040a 0%, #08030f 60%, #060218 100%)",
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full blur-3xl opacity-5"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, rgba(124,58,237,0.22), rgba(124,58,237,0.08) 30%, rgba(0,0,0,0) 55%)," +
              "radial-gradient(circle at 70% 60%, rgba(96,165,250,0.12), rgba(99,102,241,0.05) 30%, rgba(0,0,0,0) 55%)",
          }}
        />
        <div
          className="absolute bottom-[-300px] left-[-300px] w-[700px] h-[700px] rounded-full blur-2xl opacity-4"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,99,132,0.07), rgba(255,200,255,0.03) 20%, rgba(0,0,0,0) 60%)",
          }}
        />
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

      <Sidebar />

      <div
        className="flex-1 flex flex-col relative min-h-screen w-full overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #050611 0%, #0b0713 55%, #09041a 100%)",
        }}
      >
        <Topbar />
        <Toaster position="top-right" />

        <main className="relative z-10 p-10 pb-20 min-h-screen w-full space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1
                className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)" }}
              >
                Analytics
              </h1>
              <p className="text-gray-300 mt-2">Get deeper insights into your spending and income trends.</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Filter by month (e.g. Nov)"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="p-2 rounded-xl bg-white/10 text-gray-200 border border-white/20 placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={handleFilter}
                className="px-4 py-2 rounded-xl text-white font-medium"
                style={{ background: "linear-gradient(90deg,#7c3aed,#60a5fa)" }}
              >
                Filter
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20 transition"
              >
                Export
              </button>
            </div>
          </div>

          {/* Top row: summary (dashboard white cards) + AI insight */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* summary cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                }}
              >
                <div className="text-sm text-gray-500">Total Income</div>
                <div className="text-[28px] font-medium text-gray-900 mt-2">{fmt(summary.income)}</div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                }}
              >
                <div className="text-sm text-gray-500">Total Expenses</div>
                <div className="text-[28px] font-medium text-gray-900 mt-2">{fmt(summary.expenses)}</div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                }}
              >
                <div className="text-sm text-gray-500">Net Savings</div>
                <div className="text-[28px] font-medium text-gray-900 mt-2">{fmt(summary.savings)}</div>
              </div>
            </div>

            {/* AI insights */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
              }}
            >
              <h3 className="text-gray-700 font-medium">AI Insights</h3>
              <p className="text-gray-500 text-sm mt-3">{aiInsight}</p>
              <div className="mt-4">
                <button
                  onClick={fetchAiInsight}
                  className="px-3 py-1 rounded-full text-white text-sm"
                  style={{ background: "linear-gradient(90deg,#7c3aed,#60a5fa)" }}
                >
                  Refresh insight
                </button>
              </div>
            </div>
          </div>

          {/* Main panels: Chart, Heatmap, Category Trends, Category Comparison */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left / main: Monthly bar chart + heatmap */}
            <div className="xl:col-span-2 space-y-6">
              {/* Monthly Overview (bar chart) */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Overview</h3>
                  <div className="text-sm text-gray-500">Bar: income vs expenses</div>
                </div>

                <div className="mt-6" style={{ height: 320 }}>
                  {filteredData.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">No data available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            background: "#0f1724",
                            border: "1px solid #2c2f36",
                            borderRadius: 10,
                            color: "white",
                          }}
                        />
                        <Bar dataKey="income" fill="#4ade80" name="Income" />
                        <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Heatmap */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Spending Heatmap</h3>
                  <div className="text-sm text-gray-500">Daily spending intensity</div>
                </div>

                <div className="mt-6">
                  {heatmapData.length === 0 ? (
                    <div className="text-gray-500">No daily data for selected month.</div>
                  ) : (
                    <div>
                      {/* A simple grid of days */}
                      <div className="grid grid-cols-7 gap-2">
                        {heatmapData.map((d) => (
                          <div
                            key={d.day}
                            title={`Day ${d.day}: ${fmt(d.total)}`}
                            className="rounded-md h-10 flex items-center justify-center text-xs font-medium"
                            style={{
                              background: heatColor(d.intensity),
                              color: d.intensity > 0.45 ? "#fff" : "#cbd5e1",
                              border: "1px solid rgba(0,0,0,0.06)",
                            }}
                          >
                            {d.day}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
                        <div>Low</div>
                        <div className="h-3 flex-1 bg-gradient-to-r from-[#222226] via-[#fb7185] to-[#7c3aed] rounded" />
                        <div>High</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column: Category Trends & Comparison */}
            <div className="space-y-6">
              {/* Category trend lines (top categories) */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Category Trends</h3>
                  <div className="text-sm text-gray-500">Top categories (last 6 months)</div>
                </div>

                <div className="mt-4" style={{ height: 220 }}>
                  {categoryTrends.chartData && categoryTrends.chartData.length > 0 && categoryTrends.topCategories && categoryTrends.topCategories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={categoryTrends.chartData}>
                        <CartesianGrid stroke="#00000010" strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Legend />
                        {categoryTrends.topCategories.map((cat, i) => (
                          <Line
                            key={cat}
                            type="monotone"
                            dataKey={cat}
                            stroke={["#60a5fa", "#10b981", "#f59e0b", "#fb7185"][i % 4]}
                            strokeWidth={2}
                            dot={false}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-500">Not enough data for category trends.</div>
                  )}
                </div>
              </div>

              {/* Category comparison table */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Category Comparison</h3>
                  <div className="text-sm text-gray-500">This month vs Last month</div>
                </div>

                <div className="mt-4 overflow-auto">
                  {categoryComparison.length === 0 ? (
                    <div className="text-gray-500">No category comparisons available.</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="py-2 text-gray-500">Category</th>
                          <th className="py-2 text-gray-500">This month</th>
                          <th className="py-2 text-gray-500">Last month</th>
                          <th className="py-2 text-gray-500">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryComparison.map((r) => (
                          <tr key={r.category} className="border-t">
                            <td className="py-3 text-gray-700">{r.category}</td>
                            <td className="py-3 text-gray-900 font-medium">{fmt(r.thisMonth)}</td>
                            <td className="py-3 text-gray-600">{fmt(r.lastMonth)}</td>
                            <td className={`py-3 ${r.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                              {r.change === 100 && r.lastMonth === 0 ? "New" : `${r.change >= 0 ? "+" : ""}${r.change.toFixed(0)}%`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// export default function Analytics() {
//   const [summary, setSummary] = useState({
//     income: 0,
//     expenses: 0,
//     savings: 0,
//   });

//   const [monthlyData, setMonthlyData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filterMonth, setFilterMonth] = useState("");

//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const token = localStorage.getItem("token");

//   const fetchAnalytics = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/analytics", {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         params: { userId: user?._id },
//       });

//       const data = res.data || {};

//       setSummary({
//         income: data.totalIncome || 0,
//         expenses: data.totalExpenses || 0,
//         savings: (data.totalIncome || 0) - (data.totalExpenses || 0),
//       });

//       setMonthlyData(data.monthlyOverview || []);
//       setFilteredData(data.monthlyOverview || []);
//     } catch (err) {
//       console.error("❌ Error fetching analytics:", err);
//       toast.error("Failed to load analytics data");
//     }
//   };

//   useEffect(() => {
//     fetchAnalytics();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleFilter = () => {
//     if (!filterMonth) {
//       setFilteredData(monthlyData);
//       return;
//     }
//     const filtered = monthlyData.filter((d) =>
//       (d.month || "").toLowerCase().includes(filterMonth.toLowerCase())
//     );
//     setFilteredData(filtered);
//   };

//   const handleExport = () => {
//     toast.success("📊 Report exported successfully!");
//     // Placeholder for CSV/PDF export in future
//   };

//   // Use the same texture used in Dashboard
//   const uploadedTexturePath =
//     "/mnt/data/A_digital_screenshot_of_a_web_application_named_%22F.png";

//   return (
//     <div className="flex min-h-screen relative overflow-hidden">
//       {/* Background (match Dashboard) */}
//       <div className="absolute inset-0 -z-30 overflow-hidden">
//         <div
//           className="absolute inset-0"
//           style={{
//             background:
//               "radial-gradient(1200px 600px at 10% 10%, rgba(67,56,202,0.12), transparent 12%)," +
//               "radial-gradient(900px 500px at 85% 20%, rgba(220, 95, 255, 0.06), transparent 18%)," +
//               "linear-gradient(180deg, #03040a 0%, #08030f 60%, #060218 100%)",
//           }}
//         />

//         <div
//           className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full blur-3xl opacity-5"
//           style={{
//             background:
//               "radial-gradient(circle at 25% 25%, rgba(124,58,237,0.22), rgba(124,58,237,0.08) 30%, rgba(0,0,0,0) 55%)," +
//               "radial-gradient(circle at 70% 60%, rgba(96,165,250,0.12), rgba(99,102,241,0.05) 30%, rgba(0,0,0,0) 55%)",
//           }}
//         />

//         <div
//           className="absolute bottom-[-300px] left-[-300px] w-[700px] h-[700px] rounded-full blur-2xl opacity-4"
//           style={{
//             background:
//               "radial-gradient(circle at 40% 40%, rgba(255,99,132,0.07), rgba(255,200,255,0.03) 20%, rgba(0,0,0,0) 60%)",
//           }}
//         />

//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `url("${uploadedTexturePath}")`,
//             backgroundSize: "cover",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             opacity: 0.04,
//             mixBlendMode: "overlay",
//           }}
//         />
//       </div>

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
//           <div className="flex justify-between items-center mb-8">
//             <h1
//               className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text"
//               style={{
//                 backgroundImage: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
//               }}
//             >
//               Analytics
//             </h1>

//             <div className="flex gap-3">
//               <input
//                 type="text"
//                 placeholder="Filter by month (e.g. Nov)"
//                 value={filterMonth}
//                 onChange={(e) => setFilterMonth(e.target.value)}
//                 className="p-2 rounded-xl bg-white/20 text-gray-200 border border-white/30 placeholder-gray-400 focus:outline-none"
//               />

//               <button
//                 onClick={handleFilter}
//                 className="px-4 py-2 rounded-xl text-white font-medium"
//                 style={{
//                   background: "linear-gradient(90deg,#7c3aed,#60a5fa)",
//                 }}
//               >
//                 Filter
//               </button>

//               <button
//                 onClick={handleExport}
//                 className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-gray-200 hover:bg-white/30 transition"
//               >
//                 Export
//               </button>
//             </div>
//           </div>

//           <p className="text-gray-300 mb-10">
//             Get insights into your spending and income trends.
//           </p>

//           {/* Summary Cards - Dashboard Style */}
// <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//   <div
//     className="rounded-2xl p-6"
//     style={{
//       background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))",
//       border: "1px solid rgba(255,255,255,0.06)",
//       boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
//     }}
//   >
//     <h3 className="text-gray-500 text-sm tracking-wide">Total Income</h3>
//     <p className="text-[28px] font-medium text-gray-900 mt-2">
//       ₹{Number(summary.income || 0).toLocaleString()}
//     </p>
//   </div>

//   <div
//     className="rounded-2xl p-6"
//     style={{
//       background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))",
//       border: "1px solid rgba(255,255,255,0.06)",
//       boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
//     }}
//   >
//     <h3 className="text-gray-500 text-sm tracking-wide">Total Expenses</h3>
//     <p className="text-[28px] font-medium text-gray-900 mt-2">
//       ₹{Number(summary.expenses || 0).toLocaleString()}
//     </p>
//   </div>

//   <div
//     className="rounded-2xl p-6"
//     style={{
//       background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))",
//       border: "1px solid rgba(255,255,255,0.06)",
//       boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
//     }}
//   >
//     <h3 className="text-gray-500 text-sm tracking-wide">Net Savings</h3>
//     <p className="text-[28px] font-medium text-gray-900 mt-2">
//       ₹{Number(summary.savings || 0).toLocaleString()}
//     </p>
//   </div>
// </div>


//           {/* Chart card (dashboard white-glass style) */}
//           <div
//             className="rounded-2xl p-6"
//             style={{
//               background:
//                 "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
//               border: "1px solid rgba(255,255,255,0.06)",
//               boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
//             }}
//           >
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Monthly Overview
//             </h2>

//             {filteredData.length === 0 ? (
//               <p className="text-gray-500 text-center py-6">No data available.</p>
//             ) : (
//               <ResponsiveContainer width="100%" height={320}>
//                 <BarChart data={filteredData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
//                   <XAxis dataKey="month" stroke="#6b7280" />
//                   <YAxis stroke="#6b7280" />
//                   <Tooltip
//                     contentStyle={{
//                       background: "#0f1724",
//                       border: "1px solid #2c2f36",
//                       borderRadius: 10,
//                       color: "white",
//                     }}
//                   />
//                   <Bar dataKey="income" fill="#4ade80" name="Income" />
//                   <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// export default function Analytics() {
//   const [summary, setSummary] = useState({
//     income: 0,
//     expenses: 0,
//     savings: 0,
//   });
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filterMonth, setFilterMonth] = useState("");
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");

//   const fetchAnalytics = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/analytics", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { userId: user._id },
//       });

//       const data = res.data;

//       setSummary({
//         income: data.totalIncome || 0,
//         expenses: data.totalExpenses || 0,
//         savings: (data.totalIncome || 0) - (data.totalExpenses || 0),
//       });

//       setMonthlyData(data.monthlyOverview || []);
//       setFilteredData(data.monthlyOverview || []);
//     } catch (err) {
//       console.error("❌ Error fetching analytics:", err);
//       toast.error("Failed to load analytics data");
//     }
//   };

//   useEffect(() => {
//     fetchAnalytics();
//   }, []);

//   const handleFilter = () => {
//     if (!filterMonth) {
//       setFilteredData(monthlyData);
//       return;
//     }
//     const filtered = monthlyData.filter((d) =>
//       d.month.toLowerCase().includes(filterMonth.toLowerCase())
//     );
//     setFilteredData(filtered);
//   };

//   const handleExport = () => {
//     toast.success("📊 Report exported successfully!");
//     // You can later add CSV/PDF export logic here
//   };

//   return (
//     <div className="flex h-screen bg-blue-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Topbar />
//         <Toaster position="top-right" />

//         <main className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-blue-100 overflow-y-auto">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-blue-800">
//               Financial Analytics
//             </h1>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Filter by month (e.g. Nov)"
//                 value={filterMonth}
//                 onChange={(e) => setFilterMonth(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
//               />
//               <button
//                 onClick={handleFilter}
//                 className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Filter
//               </button>
//               <button
//                 onClick={handleExport}
//                 className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
//               >
//                 Export
//               </button>
//             </div>
//           </div>

//           <p className="text-gray-600 mb-8">
//             Get insights into your spending and income trends.
//           </p>

//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//             <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
//               <h3 className="text-gray-500 text-sm">Total Income</h3>
//               <p className="text-2xl font-bold text-green-600 mt-2">
//                 ₹{summary.income.toLocaleString()}
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500">
//               <h3 className="text-gray-500 text-sm">Total Expenses</h3>
//               <p className="text-2xl font-bold text-red-500 mt-2">
//                 ₹{summary.expenses.toLocaleString()}
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
//               <h3 className="text-gray-500 text-sm">Net Savings</h3>
//               <p className="text-2xl font-bold text-blue-600 mt-2">
//                 ₹{summary.savings.toLocaleString()}
//               </p>
//             </div>
//           </div>

//           {/* Monthly Overview Chart */}
//           <div className="bg-white p-6 rounded-2xl shadow-md">
//             <h2 className="text-lg font-semibold text-blue-700 mb-4">
//               Monthly Overview
//             </h2>

//             {filteredData.length === 0 ? (
//               <p className="text-gray-500 text-center py-6">
//                 No data available.
//               </p>
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={filteredData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="income" fill="#16a34a" name="Income" />
//                   <Bar dataKey="expenses" fill="#dc2626" name="Expenses" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
