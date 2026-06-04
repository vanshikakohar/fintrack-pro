import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bankName: {
      type: String,
      required: true,
    },

    accountName: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "Bank",
        "Wallet",
        "Credit Card",
        "Savings",
        "Cash",
        "Investment",
      ],
      default: "Bank",
    },

    balance: {
      type: Number,
      default: 0,
    },

    // ✅ TOTAL INCOME
    income: {
      type: Number,
      default: 0,
    },

    // ✅ TOTAL EXPENSE
    expense: {
      type: Number,
      default: 0,
    },

    // ✅ TOTAL TRANSACTIONS
    transactionsCount: {
      type: Number,
      default: 0,
    },

    color: {
      type: String,
      default: "from-violet-600 to-blue-500",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Account",
  accountSchema
);