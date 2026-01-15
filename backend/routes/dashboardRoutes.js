import express from "express";
import Transaction from "../models/Transaction.js";
const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const income = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);

    const categories = [];
    transactions.forEach(t => {
      const existing = categories.find(c => c.category === t.category || "Other");
      if (existing) existing.amount += t.amount;
      else categories.push({ category: t.category || "Other", amount: t.amount });
    });

    res.json({
      summary: { income, expense, balance: income - expense },
      categories,
      recentTransactions: transactions.slice(-5).reverse()
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading summary" });
  }
});

export default router;
