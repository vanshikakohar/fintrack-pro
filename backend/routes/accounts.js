import express from "express";
import Account from "../models/Account.js";
const router = express.Router();

// GET accounts
router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.query.userId });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD account
router.post("/add", async (req, res) => {
  try {
    const newAcc = new Account(req.body);
    await newAcc.save();
    res.json(newAcc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE account (ADDED — NOTHING ELSE CHANGED)
router.delete("/:id", async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
