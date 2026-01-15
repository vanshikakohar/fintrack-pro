import Transaction from "../models/Transaction.js";

/**
 * ============================
 * ADD TRANSACTION
 * ============================
 */
export const addTransaction = async (req, res) => {
  try {
    const { userId, type, amount, category, description, date } = req.body;

    // 🔒 Validation
    if (!userId || !type || !amount || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Save transaction ONLY (NO budget update here)
    const transaction = await Transaction.create({
      userId,
      type,
      amount: Number(amount),
      category: category.toLowerCase(), // 🔥 IMPORTANT
      description,
      date,
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error("❌ Error adding transaction:", err);
    res.status(500).json({
      message: "Error adding transaction",
      error: err.message,
    });
  }
};

/**
 * ============================
 * GET ALL TRANSACTIONS
 * ============================
 */
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const transactions = await Transaction.find({ userId }).sort({
      date: -1,
    });

    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({
      message: "Error fetching transactions",
      error: err.message,
    });
  }
};

/**
 * ============================
 * DELETE TRANSACTION
 * ============================
 */
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const tx = await Transaction.findById(id);
    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // ✅ Just delete transaction (NO budget logic)
    await Transaction.findByIdAndDelete(id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    res.status(500).json({
      message: "Error deleting transaction",
      error: err.message,
    });
  }
};




















// import Transaction from "../models/Transaction.js";
// import Budget from "../models/Budget.js";

// /**
//  * ============================
//  * ADD TRANSACTION
//  * ============================
//  */
// export const addTransaction = async (req, res) => {
//   try {
//     const { userId, type, amount, category, description, date } = req.body;

//     // 🔒 Validation
//     if (!userId || !type || !amount || !category) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // ✅ Save transaction
//     const transaction = await Transaction.create({
//       userId,
//       type,
//       amount: Number(amount),
//       category,
//       description,
//       date,
//     });

//     // ✅ Update budget if EXPENSE
//     if (type === "expense") {
//       const d = date ? new Date(date) : new Date();
//       const monthName = d.toLocaleString("default", { month: "long" });

//       const budget = await Budget.findOne({
//         userId,
//         month: new RegExp(`^${monthName}$`, "i"),
//         category: new RegExp(`^${category}$`, "i"),
//       });

//       if (budget) {
//         budget.spent = (budget.spent || 0) + Number(amount);
//         await budget.save();
//       }
//     }

//     res.status(201).json(transaction);
//   } catch (err) {
//     console.error("❌ Error adding transaction:", err);
//     res.status(500).json({
//       message: "Error adding transaction",
//       error: err.message,
//     });
//   }
// };

// /**
//  * ============================
//  * GET ALL TRANSACTIONS
//  * ============================
//  */
// export const getTransactions = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }

//     const transactions = await Transaction.find({ userId }).sort({
//       date: -1,
//     });

//     res.json(transactions);
//   } catch (err) {
//     console.error("❌ Error fetching transactions:", err);
//     res.status(500).json({
//       message: "Error fetching transactions",
//       error: err.message,
//     });
//   }
// };

// /**
//  * ============================
//  * DELETE TRANSACTION
//  * ============================
//  */
// export const deleteTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const tx = await Transaction.findById(id);
//     if (!tx) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }

//     // ✅ Update budget if EXPENSE
//     if (tx.type === "expense") {
//       const d = tx.date ? new Date(tx.date) : new Date();
//       const monthName = d.toLocaleString("default", { month: "long" });

//       const budget = await Budget.findOne({
//         userId: tx.userId,
//         month: new RegExp(`^${monthName}$`, "i"),
//         category: new RegExp(`^${tx.category}$`, "i"),
//       });

//       if (budget) {
//         budget.spent = Math.max(
//           0,
//           (budget.spent || 0) - Number(tx.amount)
//         );
//         await budget.save();
//       }
//     }

//     await Transaction.findByIdAndDelete(id);

//     res.json({ message: "Transaction deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting transaction:", err);
//     res.status(500).json({
//       message: "Error deleting transaction",
//       error: err.message,
//     });
//   }
// };




// import Transaction from "../models/Transaction.js";
// import Budget from "../models/Budget.js";

// // ADD TRANSACTION (and update budget if expense)
// export const addTransaction = async (req, res) => {
//   try {
//     const { userId, type, amount, category, description, date } = req.body;

//     if (!userId || !type || !amount || !category) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const transaction = new Transaction({
//       userId,
//       type,
//       amount,
//       category,
//       description,
//       date,
//     });

//     await transaction.save();

//     // If it's an expense, try to find a matching budget and increment its spent
//     if (type === "expense") {
//       const d = date ? new Date(date) : new Date();
//       const monthString = `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;

//       const budget = await Budget.findOne({
//         userId,
//         month: monthString,
//         category: new RegExp(`^${category}$`, "i"),
//       });

//       if (budget) {
//         budget.spent = (budget.spent || 0) + Number(amount);
//         await budget.save();
//       }
//     }

//     res.status(201).json(transaction);
//   } catch (err) {
//     console.error("❌ Error adding transaction:", err);
//     res.status(500).json({ message: "Error adding transaction", error: err.message });
//   }
// };

// // GET ALL TRANSACTIONS (by userId query param)
// export const getTransactions = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     if (!userId) return res.status(400).json({ message: "userId is required" });

//     const transactions = await Transaction.find({ userId }).sort({ date: -1 });
//     res.json(transactions);
//   } catch (err) {
//     console.error("❌ Error fetching transactions:", err);
//     res.status(500).json({ message: "Error fetching transactions", error: err.message });
//   }
// };

// // DELETE TRANSACTION (and update budget if deleted tx is expense)
// export const deleteTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const tx = await Transaction.findById(id);

//     if (!tx) return res.status(404).json({ message: "Transaction not found" });

//     // If expense, decrement the budget.spent for that month/category (if budget exists)
//     if (tx.type === "expense") {
//       const d = tx.date ? new Date(tx.date) : new Date();
//       const monthString = `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;

//       const budget = await Budget.findOne({
//         userId: tx.userId,
//         month: monthString,
//         category: new RegExp(`^${tx.category}$`, "i"),
//       });

//       if (budget) {
//         budget.spent = Math.max(0, (budget.spent || 0) - Number(tx.amount));
//         await budget.save();
//       }
//     }

//     await Transaction.findByIdAndDelete(id);
//     res.json({ message: "Transaction deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting transaction:", err);
//     res.status(500).json({ message: "Error deleting transaction", error: err.message });
//   }
// };




// import Transaction from "../models/Transaction.js";
// import Budget from "../models/Budget.js";

// export const addTransaction = async (req, res) => {
//   try {
//     console.log("📦 Received data in backend:", req.body);
//     const { userId, type, amount, category, description } = req.body;

//     if (!userId || !type || !amount || !category) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // ✅ Save new transaction
//     const transaction = new Transaction({
//       userId,
//       type,
//       amount,
//       category,
//       description,
//     });
//     await transaction.save();
//     console.log("✅ Transaction saved:", transaction);

//     // ✅ Update budget if it's an expense
//     if (type === "expense") {
//       const currentMonth = new Date().toLocaleString("default", { month: "long" });
//       const currentYear = new Date().getFullYear();
//       const monthString = `${currentMonth} ${currentYear}`;

//       const budget = await Budget.findOne({
//         userId,
//         category: new RegExp(`^${category}$`, "i"),

//         month: monthString,
//       });

//       if (budget) {
//         budget.spent += Number(amount);
//         await budget.save();
//         console.log(`📊 Updated budget for ${category}: spent = ${budget.spent}`);
//       } else {
//         console.log(`⚠️ No budget found for category: ${category}`);
//       }
//     }

//     res.status(201).json(transaction);
//   } catch (err) {
//     console.error("❌ Error adding transaction:", err.message);
//     res.status(500).json({ message: "Error adding transaction", error: err.message });
//   }
// };

// export const getTransactions = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
//     res.json(transactions);
//   } catch (err) {
//     console.error("❌ Error fetching transactions:", err.message);
//     res.status(500).json({ message: "Error fetching transactions", error: err.message });
//   }
// };

// export const deleteTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Transaction.findByIdAndDelete(id);
//     res.json({ message: "Transaction deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting transaction:", err.message);
//     res.status(500).json({ message: "Error deleting transaction", error: err.message });
//   }
// };
