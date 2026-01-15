import Transaction from "../models/Transaction.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ From token (authMiddleware sets this)

    // Fetch all transactions for that user
    const transactions = await Transaction.find({ userId });

    // Total income & expenses
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Group by month
    const monthlyMap = {};
    transactions.forEach((t) => {
      const month = new Date(t.date || t.createdAt).toLocaleString("default", { month: "short" });
      if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expenses: 0 };
      monthlyMap[month][t.type === "income" ? "income" : "expenses"] += t.amount;
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyOverview = Object.values(monthlyMap).sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    // ✅ Send clean response
    res.json({
      totalIncome,
      totalExpenses,
      monthlyOverview,
    });
  } catch (err) {
    console.error("❌ Error in getAnalytics:", err);
    res.status(500).json({ message: "Server error" });
  }
};
