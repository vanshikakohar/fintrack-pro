import express from "express";
import {
  addTransaction,
  getTransactions,
  deleteTransaction
} from "../controllers/transactionController.js";

import Transaction from "../models/Transaction.js";   // <-- REQUIRED

const router = express.Router();

router.post("/add", addTransaction);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);

// ✅ ADD THIS:
router.get("/summary", async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const income = transactions
      .filter(t => t.type === "income")
      .reduce((a, b) => a + Number(b.amount || 0), 0);

    const expense = transactions
      .filter(t => t.type === "expense")
      .reduce((a, b) => a + Number(b.amount || 0), 0);

    const categories = transactions.reduce((acc, t) => {
      const cat = t.category || "Other";
      acc[cat] = (acc[cat] || 0) + Number(t.amount || 0);
      return acc;
    }, {});

    const categoryList = Object.entries(categories).map(([category, amount]) => ({
      category,
      amount
    }));

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.json({
      summary: {
        income,
        expense,
        balance: income - expense,
      },
      categories: categoryList,
      recentTransactions
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading summary" });
  }
});

export default router;
// import express from "express";
// import {
//   addTransaction,
//   getTransactions,
//   deleteTransaction
// } from "../controllers/transactionController.js";

// const router = express.Router();

// router.post("/add", addTransaction);
// router.get("/", getTransactions);
// router.delete("/:id", deleteTransaction);

// export default router;


// import express from "express";
// import { addTransaction, getTransactions, deleteTransaction } from "../controllers/transactionController.js";

// const router = express.Router();

// router.post("/add", addTransaction);
// router.get("/", getTransactions);
// router.delete("/:id", deleteTransaction);

// export default router;

