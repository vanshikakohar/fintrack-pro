
import express from "express";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

/* ================= GET ================= */

router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find({
      userId: req.query.userId,
    });

    const enrichedAccounts = await Promise.all(
      accounts.map(async (acc) => {
        const transactions = await Transaction.find({
          accountId: acc._id,
        });

        const income = transactions
          .filter((t) => t.type === "income")
          .reduce((a, b) => a + b.amount, 0);

        const expense = transactions
          .filter((t) => t.type === "expense")
          .reduce((a, b) => a + b.amount, 0);

        return {
          ...acc._doc,
          income,
          expense,
          transactionsCount: transactions.length,
        };
      })
    );

    res.json(enrichedAccounts);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ================= ADD ================= */

router.post("/add", async (req, res) => {
  try {
    const newAcc = new Account(req.body);

    await newAcc.save();

    res.json(newAcc);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ================= DELETE ================= */

router.delete("/:id", async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);

    res.json({
      message: "Account deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;