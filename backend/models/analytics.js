import Transaction from "../models/Transaction.js";

export const getAnalytics = async (req, res) => {
  try {
    const { userId } = req.query;
    const transactions = await Transaction.find({ userId });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Group by month
    const monthlyMap = {};
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" });
      if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expenses: 0 };
      monthlyMap[month][t.type === "income" ? "income" : "expenses"] += t.amount;
    });

    res.json({
      totalIncome,
      totalExpenses,
      monthlyOverview: Object.values(monthlyMap),
    });
  } catch (err) {
    console.error("Error in getAnalytics:", err);
    res.status(500).json({ message: "Server error" });
  }
};
