import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const transactions = await Transaction.find();

    let income = 0;
    let expense = 0;

    const categories = [];

    transactions.forEach((t) => {
      const amount = Number(t.amount);

      // INCOME / EXPENSE
      if (t.type === "income") {
        income += amount;
      } else if (t.type === "expense") {
        expense += amount;
      }

      // CATEGORY TOTALS
      const categoryName = t.category || "Other";

      const existing = categories.find(
        (c) => c.category === categoryName
      );

      if (existing) {
        existing.amount += amount;
      } else {
        categories.push({
          category: categoryName,
          amount: amount,
        });
      }
    });

    res.json({
      summary: {
        income,
        expense,
        balance: income - expense,
      },
      categories,
      recentTransactions: transactions.slice(-5).reverse(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error loading summary",
    });
  }
});

export default router;
// import express from "express";
// import Transaction from "../models/Transaction.js";
// const router = express.Router();

// router.get("/summary", async (req, res) => {
//   try {
//     const transactions = await Transaction.find();
//     const income = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
//     const expense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);

//     const categories = [];
//     transactions.forEach(t => {
//       const existing = categories.find(c => c.category === t.category || "Other");
//       if (existing) existing.amount += t.amount;
//       else categories.push({ category: t.category || "Other", amount: t.amount });
//     });

//     res.json({
//       summary: { income, expense, balance: income - expense },
//       categories,
//       recentTransactions: transactions.slice(-5).reverse()
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error loading summary" });
//   }
// });

// export default router;
