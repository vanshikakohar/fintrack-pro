import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

/* ===========================
   GET BUDGETS (WITH SPENT)
=========================== */
export const getBudgets = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    // GET USER BUDGETS
    const budgets = await Budget.find({ userId }).sort({
      createdAt: -1,
    });

    const results = [];

    for (const budget of budgets) {
      // Example: "July 2026"
      const [monthName, year] = budget.month.split(" ");

      if (!monthName || !year) continue;

      // MONTH RANGE
      const start = new Date(`${monthName} 1, ${year}`);

      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      // CALCULATE SPENT
      const spentAgg = await Transaction.aggregate([
        {
          $match: {
            userId: budget.userId,
            type: "expense",

            date: {
              $gte: start,
              $lt: end,
            },
          },
        },

        // convert transaction category to lowercase
        {
          $addFields: {
            normalizedCategory: {
              $toLower: "$category",
            },
          },
        },

        // compare lowercase categories
        {
          $match: {
            normalizedCategory:
              budget.category.toLowerCase(),
          },
        },

        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

      const spent =
        spentAgg.length > 0
          ? spentAgg[0].total
          : 0;

      // FINAL OBJECT
      results.push({
        _id: budget._id,
        userId: budget.userId,
        category: budget.category,
        month: budget.month,
        limit: budget.limit,
        spent,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      });
    }

    res.json(results);

  } catch (err) {
    console.error(
      "❌ Error fetching budgets:",
      err
    );

    res.status(500).json({
      message: "Error fetching budgets",
    });
  }
};

/* ===========================
   ADD BUDGET
=========================== */
export const addBudget = async (req, res) => {
  try {
    const {
      userId,
      category,
      limit,
      month,
    } = req.body;

    if (
      !userId ||
      !category ||
      !limit ||
      !month
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const budget = new Budget({
      userId,

      // SAVE LOWERCASE
      category: category.toLowerCase(),

      limit: Number(limit),

      month,
    });

    await budget.save();

    res.status(201).json(budget);

  } catch (err) {
    console.error(
      "❌ Error adding budget:",
      err
    );

    res.status(500).json({
      message: "Error adding budget",
    });
  }
};

/* ===========================
   DELETE BUDGET
=========================== */
export const deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Budget deleted",
    });

  } catch (err) {
    console.error(
      "❌ Error deleting budget:",
      err
    );

    res.status(500).json({
      message: "Error deleting budget",
    });
  }
};
// import Budget from "../models/Budget.js";
// import Transaction from "../models/Transaction.js";

// /* ===========================
//    GET BUDGETS (WITH SPENT)
// =========================== */
// export const getBudgets = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }

//     // 1️⃣ Get all budgets for user
//     const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });

//     const results = [];

//     for (const budget of budgets) {
//       // 2️⃣ Parse "December 2026"
//       const [monthName, year] = budget.month.split(" ");
//       if (!monthName || !year) continue;

//       const start = new Date(`${monthName} 1, ${year}`);
//       const end = new Date(start);
//       end.setMonth(end.getMonth() + 1);

//       // 3️⃣ Aggregate expense transactions
//       const spentAgg = await Transaction.aggregate([
//         {
//           $match: {
//             userId: budget.userId,
//             type: "expense",
//             category: budget.category.toLowerCase(),

//             date: {
//               $gte: start,
//               $lt: end,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             total: { $sum: "$amount" },
//           },
//         },
//       ]);

//       const spent = spentAgg.length > 0 ? spentAgg[0].total : 0;

//       // 4️⃣ Attach spent dynamically
//       results.push({
//         _id: budget._id,
//         userId: budget.userId,
//         category: budget.category,
//         month: budget.month,
//         limit: budget.limit,
//         spent,
//         createdAt: budget.createdAt,
//         updatedAt: budget.updatedAt,
//       });
//     }

//     res.json(results);
//   } catch (err) {
//     console.error("❌ Error fetching budgets:", err);
//     res.status(500).json({ message: "Error fetching budgets" });
//   }
// };

// /* ===========================
//    ADD BUDGET
// =========================== */
// export const addBudget = async (req, res) => {
//   try {
//     const { userId, category, limit, month } = req.body;

//     if (!userId || !category || !limit || !month) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const budget = new Budget({
//       userId,
//       category: category.toLowerCase(),
//       limit: Number(limit),
//       month,
//     });

//     await budget.save();
//     res.status(201).json(budget);
//   } catch (err) {
//     console.error("❌ Error adding budget:", err);
//     res.status(500).json({ message: "Error adding budget" });
//   }
// };

// /* ===========================
//    DELETE BUDGET
// =========================== */
// export const deleteBudget = async (req, res) => {
//   try {
//     await Budget.findByIdAndDelete(req.params.id);
//     res.json({ message: "Budget deleted" });
//   } catch (err) {
//     console.error("❌ Error deleting budget:", err);
//     res.status(500).json({ message: "Error deleting budget" });
//   }
// };








// import Budget from "../models/Budget.js";
// import Transaction from "../models/Transaction.js";

// // GET ALL BUDGETS + CURRENT SPENDING
// export const getBudgets = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const budgets = await Budget.find({ userId });

//     const transactions = await Transaction.find({ userId });

//     // Calculate spent per category
//     const categoryTotals = {};
//     transactions.forEach((t) => {
//       if (t.type === "expense") {
//         if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
//         categoryTotals[t.category] += t.amount;
//       }
//     });

//     // Merge spent with each budget
//     const finalBudgets = budgets.map((b) => ({
//       ...b._doc,
//       spent: categoryTotals[b.category] || 0,   // ⭐ budget now linked!
//     }));

//     res.json(finalBudgets);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching budgets" });
//   }
// };

// // ADD BUDGET
// export const addBudget = async (req, res) => {
//   try {
//     const { userId, category, limit, month } = req.body;

//     const budget = await Budget.create({
//       userId,
//       category: category.toLowerCase(),
//       limit,
//       month,
//     });

//     res.status(201).json(budget);
//   } catch (err) {
//     res.status(500).json({ message: "Error adding budget" });
//   }
// };

// // DELETE BUDGET
// export const deleteBudget = async (req, res) => {
//   try {
//     await Budget.findByIdAndDelete(req.params.id);
//     res.json({ message: "Budget deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting budget" });
//   }
// };
// import Budget from "../models/Budget.js";

// export const getBudgets = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
//     res.json(budgets);
//   } catch (err) {
//     console.error("❌ Error fetching budgets:", err.message);
//     res.status(500).json({ message: "Error fetching budgets" });
//   }
// };

// export const addBudget = async (req, res) => {
//   try {
//     const { userId, category, limit, month } = req.body;
//     const budget = new Budget({
//       userId,
//       category: category.toLowerCase(),
//       limit,
//       month,
//     });
//     await budget.save();
//     res.status(201).json(budget);
//   } catch (err) {
//     console.error("❌ Error adding budget:", err.message);
//     res.status(500).json({ message: "Error adding budget" });
//   }
// };

// export const deleteBudget = async (req, res) => {
//   try {
//     await Budget.findByIdAndDelete(req.params.id);
//     res.json({ message: "Budget deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting budget" });
//   }
// };
