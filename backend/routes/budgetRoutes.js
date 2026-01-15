import express from "express";
import { addBudget, getBudgets, deleteBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.post("/add", addBudget);
router.get("/", getBudgets);
router.delete("/:id", deleteBudget);

export default router;


