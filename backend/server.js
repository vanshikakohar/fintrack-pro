import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import accountsRoutes from "./routes/accounts.js";
import billsRoutes from "./routes/bills.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import financeAIRoutes from "./routes/financeAI.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import splitRoutes from "./routes/splitRoutes.js";
import documentsRoutes from "./routes/documentsRoutes.js";
dotenv.config();
const app = express();

// ✅ Middleware (MATCH VITE)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ REQUIRED

// ✅ Connect DB
connectDB();

// ✅ API Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/split", splitRoutes);
app.use("/api/finance-ai", financeAIRoutes);
app.use("/api/financeai", financeAIRoutes);
app.use("/api/documents", documentsRoutes);
// Health check
app.get("/", (req, res) => {
  res.json({ message: "FinTrack Pro API is running..." });
});

const PORT = process.env.PORT || 5000;
// 🔥 GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE:", err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// // Routes
// import authRoutes from "./routes/authRoutes.js";
// import transactionRoutes from "./routes/transactionRoutes.js";
// import analyticsRoutes from "./routes/analyticsRoutes.js";
// import budgetRoutes from "./routes/budgetRoutes.js";
// import accountsRoutes from "./routes/accounts.js";
// import billsRoutes from "./routes/bills.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// import financeAIRoutes from "./routes/financeAI.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import splitRoutes from "./routes/splitRoutes.js";

// dotenv.config();
// const app = express();

// // ✅ Middleware
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:5174",
//     "http://127.0.0.1:5173",
//     "http://127.0.0.1:5174"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));



// app.use(express.json());

// // ✅ Connect DB
// connectDB();

// // ✅ API Routes
// app.use("/uploads", express.static("uploads"));
// app.use("/api/auth", authRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/budgets", budgetRoutes);
// app.use("/api/accounts", accountsRoutes);
// app.use("/api/bills", billsRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/split", splitRoutes);

// // Finance AI
// app.use("/api/finance-ai", financeAIRoutes);
// app.use("/api/financeai", financeAIRoutes);

// // Health check
// app.get("/", (req, res) => {
//   res.json({ message: "FinTrack Pro API is running..." });
// });

// // API-only 404
// app.use("/api", (req, res) => {
//   res.status(404).json({ error: "API route not found" });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("🔥 SERVER ERROR:", err);
//   res.status(500).json({ error: "Server error occurred" });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );


// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// // Routes
// import authRoutes from "./routes/authRoutes.js";
// import transactionRoutes from "./routes/transactionRoutes.js";
// import analyticsRoutes from "./routes/analyticsRoutes.js";
// import budgetRoutes from "./routes/budgetRoutes.js";
// import accountsRoutes from "./routes/accounts.js";
// import billsRoutes from "./routes/bills.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// import financeAIRoutes from "./routes/financeAI.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import splitRoutes from "./routes/splitRoutes.js";

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect DB
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/budgets", budgetRoutes);
// app.use("/api/accounts", accountsRoutes);
// app.use("/api/bills", billsRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/finance-ai", financeAIRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/split", splitRoutes);
// // Default "API is running" JSON
// app.get("/", (req, res) => {
//   res.json({ message: "FinTrack Pro API is running..." });
// });

// // 404 handler (prevents HTML errors)
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
