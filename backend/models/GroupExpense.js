// backend/models/GroupExpense.js
import mongoose from "mongoose";

const splitSchema = new mongoose.Schema({
  memberName: String,
  amount: { type: Number, default: 0 }
}, { _id: false });

const groupExpenseSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true },
  splits: { type: [splitSchema], default: [] },
  date: { type: Date, default: Date.now },
  meta: { type: Object }
});

export default mongoose.model("GroupExpense", groupExpenseSchema);
