// backend/models/Settlement.js
import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  status: { type: String, enum: ["pending","settled"], default: "pending" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Settlement", settlementSchema);

