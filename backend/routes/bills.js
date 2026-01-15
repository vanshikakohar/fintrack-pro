// routes/bills.js
import express from "express";
const router = express.Router();

router.get("/upcoming", (req, res) => {
  const upcomingBills = [
    { name: "Electricity Bill", dueDate: "2025-11-20", amount: 1200, status: "Due Soon" },
    { name: "Netflix Subscription", dueDate: "2025-11-18", amount: 499, status: "Due Soon" },
    { name: "Water Bill", dueDate: "2025-11-25", amount: 600, status: "Pending" },
  ];
  res.json({ upcomingBills });
});

export default router;
