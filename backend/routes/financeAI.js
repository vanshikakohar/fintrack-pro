// backend/routes/financeAI.js
import express from "express";
const router = express.Router();

// Local-only replies — NO OpenAI, NO axios, NO API KEYS
function generateMockResponse(prompt) {
  const lower = String(prompt || "").toLowerCase();
  const spend = Math.floor(Math.random() * 15000) + 1000; // ₹1k–₹16k
  const savings = Math.floor(spend * 0.25);

  if (lower.includes("spent") || lower.includes("expense") || lower.includes("money")) {
    return `💸 Based on your recent pattern, you’ve spent roughly ₹${spend.toLocaleString()} this month. Try saving at least ₹${savings.toLocaleString()} next month.`;
  } else if (lower.includes("budget")) {
    return `📊 Your budget seems balanced. Consider allocating around ₹${Math.floor(spend * 0.4)} to essentials and ₹${Math.floor(spend * 0.2)} to savings.`;
  } else if (lower.includes("invest")) {
    return `📈 Investing 10–15% of income in mutual funds or SIPs is a good start. Consider beginning with around ₹${Math.floor(spend * 0.15)} this month.`;
  } else if (lower.includes("advice") || lower.includes("tip")) {
    return `💡 Quick tip: Track daily expenses and automate savings. Small habits compound into big wins.`;
  } else {
    return `🤖 Hi — I'm your local Finance Assistant. Try asking:
- "How much did I spend this month?"
- "Help with my budget"
- "Investment advice"`;
  }
}

router.post("/", (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ reply: "No query provided." });

  try {
    const reply = generateMockResponse(prompt);
    return res.json({ reply });
  } catch (err) {
    console.error("Local FinanceAI error:", err);
    return res.status(500).json({ reply: "Error generating response." });
  }
});

export default router;

// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const router = express.Router();

// // Helper for mock replies
// function generateMockResponse(prompt) {
//   const lower = prompt.toLowerCase();
//   const spend = Math.floor(Math.random() * 15000) + 1000; // random ₹1k–₹16k
//   const savings = Math.floor(spend * 0.25);

//   if (lower.includes("spent") || lower.includes("expense") || lower.includes("money")) {
//     return `💸 Based on your spending pattern, you’ve spent roughly ₹${spend.toLocaleString()} this month. Try saving at least ₹${savings.toLocaleString()} next month.`;
//   } else if (lower.includes("budget")) {
//     return `📊 Your budget looks balanced! You could allocate around ₹${Math.floor(spend * 0.4)} to essentials and ₹${Math.floor(spend * 0.2)} to savings.`;
//   } else if (lower.includes("invest")) {
//     return `📈 Investing 10–15% of your income in mutual funds or SIPs could grow your wealth steadily. Start with ₹${Math.floor(spend * 0.15)} this month.`;
//   } else if (lower.includes("advice") || lower.includes("tip")) {
//     return `💡 Quick tip: Track your daily expenses and automate savings. Small habits compound into big financial wins!`;
//   } else {
//     return `🤖 I'm your Finance Assistant! You can ask things like:
// - "How much did I spend this month?"
// - "How can I improve my budget?"
// - "Give me investment advice."`;
//   }
// }

// router.post("/", async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) return res.status(400).json({ reply: "No query provided." });

//   if (!process.env.OPENAI_API_KEY) {
//     console.log("⚠️ Mock mode active — no API key found");
//     return res.json({ reply: generateMockResponse(prompt) });
//   }

//   try {
//     const aiRes = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are FinAI, a financial assistant that gives smart, actionable, and personalized money insights.",
//           },
//           { role: "user", content: prompt },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const reply = aiRes.data.choices[0].message.content;
//     res.json({ reply });
//   } catch (err) {
//     console.error("🔥 OpenAI API Error:", err.response?.data || err.message);

//     if (err.response?.status === 429 || err.response?.data?.error?.code === "insufficient_quota") {
//       console.log("⚠️ Using mock fallback due to quota exhaustion");
//       return res.json({ reply: generateMockResponse(prompt) });
//     }

//     res.status(500).json({ reply: "Error generating response." });
//   }
// });

// export default router;
