// backend/routes/splitRoutes.js
import express from "express";
import {
  createGroup,
  getGroups,
  addGroupExpense,
  getGroupExpenses,
  createSettlement,
  getSettlements,
  generateSettlements
} from "../controllers/splitController.js";

const router = express.Router();

router.post("/groups", createGroup);
router.get("/groups", getGroups);
router.post("/groups/:groupId/expense", addGroupExpense);
router.get("/groups/:groupId/expenses", getGroupExpenses);

router.post("/settlements", createSettlement);
router.get("/settlements", getSettlements);

// auto-generate suggested settlements
router.get("/groups/:groupId/suggested-settlements", generateSettlements);

export default router;
