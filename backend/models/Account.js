import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: String,
  type: String,
  balance: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Account", accountSchema);
