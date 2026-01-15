import fs from "fs";
import Transaction from "../models/Transaction.js";
import Document from "../models/Document.js";

const detectCategory = (text = "") => {
  text = text.toLowerCase();
  if (/upi|gpay|paytm|phonepe/.test(text)) return "UPI";
  if (/zomato|swiggy|food/.test(text)) return "Food & Drinks";
  if (/amazon|flipkart|myntra/.test(text)) return "Shopping";
  if (/fuel|petrol/.test(text)) return "Fuel";
  if (/rent/.test(text)) return "Rent";
  if (/electric|water|bill/.test(text)) return "Bills";
  if (/salary|credited/.test(text)) return "Salary";
  return "Others";
};

const normalizeAmount = (amt = "0") => {
  amt = amt.toString().replace(/,/g, "");
  if (/^\(.*\)$/.test(amt)) return -Math.abs(parseFloat(amt.replace(/[()]/g, "")));
  if (/CR/i.test(amt)) return Math.abs(parseFloat(amt));
  if (/DR/i.test(amt)) return -Math.abs(parseFloat(amt));
  return parseFloat(amt) || 0;
};

export const handleFileUpload = async (req, res) => {
  const filePath = req.file?.path;

  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    // 🚑 SAFELY import pdf-parse (this prevents server crash)
    const { default: pdfParse } = await import("pdf-parse");

    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length < 50) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "This PDF contains no readable text (scanned PDFs not supported)",
      });
    }

    const extracted = [];

    data.text.split("\n").forEach((line) => {
      const amt = line.match(/-?\(?\d[\d,]*\.\d{1,2}\)?/);
      if (!amt) return;

      const amount = normalizeAmount(amt[0]);

      extracted.push({
        description: line.slice(0, 120),
        amount,
        type: amount < 0 ? "expense" : "income",
        category: detectCategory(line),
        date: new Date(),
      });
    });

    if (!extracted.length) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "No transactions found" });
    }

    // Save Document
    const document = await Document.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      transactionsCount: extracted.length,
      status: "success",
    });

    // Save Transactions
    await Transaction.insertMany(
      extracted.map((t) => ({
        ...t,
        userId: req.user.id,
        documentId: document._id,
      }))
    );

    fs.unlinkSync(filePath);

    res.json({
      message: "File analyzed successfully",
      documentId: document._id,
      transactionsAdded: extracted.length,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: err.message || "Upload failed" });
  }
};




// import fs from "fs";
// import csv from "csv-parser";
// import xlsx from "xlsx";
// import Transaction from "../models/Transaction.js";

// // dynamic import for pdf-parse


// // CATEGORY DETECTION ENGINE
// const detectCategory = (text) => {
//   text = text.toLowerCase();
//   if (/upi|gpay|paytm|phonepe|google/i.test(text)) return "UPI";
//   if (/zomato|swiggy|eat|food/i.test(text)) return "Food & Drinks";
//   if (/amazon|flipkart|myntra/i.test(text)) return "Shopping";
//   if (/fuel|petrol|hpcl|ioc|bpcl/i.test(text)) return "Fuel";
//   if (/rent|maintenance/i.test(text)) return "Rent";
//   if (/electric|water|bill|recharge/i.test(text)) return "Bills & Utilities";
//   if (/salary|payout|credited/i.test(text)) return "Salary";
//   if (/atm|withdrawal/i.test(text)) return "Cash Withdrawal";
//   if (/interest/i.test(text)) return "Interest";
//   if (/transfer/i.test(text)) return "Bank Transfer";
//   return "Others";
// };

// // NORMALIZE AMOUNT
// const normalizeAmount = (amtStr) => {
//   if (!amtStr) return 0;
//   amtStr = amtStr.replace(/,/g, "");
//   if (/^\(.*\)$/.test(amtStr))
//     return -Math.abs(parseFloat(amtStr.replace(/[()]/g, "")));
//   if (/CR/i.test(amtStr)) return Math.abs(parseFloat(amtStr));
//   if (/DR/i.test(amtStr)) return -Math.abs(parseFloat(amtStr));
//   return parseFloat(amtStr);
// };

// // FILE UPLOAD HANDLER
// export const handleFileUpload = async (req, res) => {
//   const filePath = req.file?.path;

//   try {
//     if (!filePath) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const ext = req.file.originalname.split(".").pop().toLowerCase();
//     let extracted = [];

//     // PDF
//   // =====================
// // PDF FILE HANDLING
// // =====================
// if (ext === "pdf") {
//   const { default: pdfParse } = await import("pdf-parse");

//   const buffer = fs.readFileSync(filePath);
//   const data = await pdfParse(buffer);

//   const lines = data.text.split("\n");

//   lines.forEach((line) => {
//     if (!/\d/.test(line)) return;

//     const amountMatch = line.match(/-?\(?\d[\d,]*\.\d{1,2}\)?/);
//     if (!amountMatch) return;

//     const amount = normalizeAmount(amountMatch[0]);

//     // ✅ FIXED DATE FORMAT FOR YOUR BANK PDF
//     const dateMatch = line.match(/\b\d{4}-\d{2}-\d{2}\b/);
//     const date = dateMatch ? new Date(dateMatch[0]) : new Date();

//     const desc = line
//       .replace(amountMatch[0], "")
//       .replace(dateMatch?.[0] || "", "")
//       .trim()
//       .slice(0, 100);

//     extracted.push({
//       description: desc || "PDF Entry",
//       amount,
//       type: amount < 0 ? "expense" : "income",
//       category: detectCategory(desc),
//       date,
//     });
//   });
// }


//     // CSV
//     else if (ext === "csv") {
//       const rows = [];
//       const stream = fs.createReadStream(filePath).pipe(csv());
//       for await (const row of stream) rows.push(row);

//       rows.forEach((r) => {
//         const amount = normalizeAmount(
//           r.Amount || r.amount || r["AMOUNT"] || 0
//         );
//         const rawDesc =
//           r.Description ||
//           r.Details ||
//           r["Transaction Details"] ||
//           "CSV Entry";
//         const date = new Date(r.Date || r["Transaction Date"] || Date.now());

//         extracted.push({
//           description: rawDesc,
//           amount,
//           type: amount < 0 ? "expense" : "income",
//           category: detectCategory(rawDesc),
//           date,
//         });
//       });
//     }

//     // Excel
//     else if (["xlsx", "xls"].includes(ext)) {
//       const workbook = xlsx.readFile(filePath);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const rows = xlsx.utils.sheet_to_json(sheet);

//       rows.forEach((r) => {
//         const amount = normalizeAmount(r.Amount || r.amount || 0);
//         const rawDesc = r.Description || r.Details || "Excel Entry";

//         extracted.push({
//           description: rawDesc,
//           amount,
//           type: amount < 0 ? "expense" : "income",
//           category: detectCategory(rawDesc),
//           date: new Date(r.Date || Date.now()),
//         });
//       });
//     }

//     // Save to DB
//     const userId = req.user.id;
//     const docs = extracted.map((t) => ({ ...t, userId }));
//     await Transaction.insertMany(docs);

//     res.json({
//       message: "File analyzed successfully",
//       fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
//       transactionsAdded: docs.length,
//     });
//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);
//     res.status(500).json({ message: "Error processing file" });
//   }
// };










// import fs from "fs";
// import csv from "csv-parser";
// import xlsx from "xlsx";
// import Transaction from "../models/Transaction.js";

// // ✅ dynamically import pdf-parse (for CommonJS compatibility)
// let pdfParse;
// (async () => {
//   const module = await import("pdf-parse");
//   pdfParse = module.default || module;
// })();

// export const handleFileUpload = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const filePath = req.file.path;
//     const ext = filePath.split(".").pop().toLowerCase();
//     let transactions = [];

//     // 🧾 PDF PARSING
//     if (ext === "pdf") {
//       const buffer = fs.readFileSync(filePath);
//       const data = await pdfParse(buffer);
//       const text = data.text;

//       // crude parsing: detect lines with ₹ or numbers
//       const lines = text.split("\n").filter((l) => /\d/.test(l));
//       for (const line of lines) {
//         const match = line.match(/(-?\d+(?:\.\d{1,2})?)/);
//         if (match) {
//           const amount = parseFloat(match[1]);
//           transactions.push({
//             description: line.slice(0, 80),
//             amount,
//             type: amount < 0 ? "expense" : "income",
//             date: new Date(),
//           });
//         }
//       }
//     }

//     // 📄 CSV PARSING
//     else if (ext === "csv") {
//       const rows = [];
//       const stream = fs.createReadStream(filePath).pipe(csv());
//       for await (const row of stream) rows.push(row);

//       for (const r of rows) {
//         const amount = parseFloat(r.Amount || r.amount || 0);
//         transactions.push({
//           description: r.Description || r.Details || "CSV Entry",
//           amount,
//           type: amount < 0 ? "expense" : "income",
//           date: new Date(r.Date || Date.now()),
//         });
//       }
//     }

//     // 📊 EXCEL PARSING
//     else if (["xlsx", "xls"].includes(ext)) {
//       const workbook = xlsx.readFile(filePath);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const rows = xlsx.utils.sheet_to_json(sheet);

//       for (const r of rows) {
//         const amount = parseFloat(r.Amount || r.amount || 0);
//         transactions.push({
//           description: r.Description || r.Details || "Excel Entry",
//           amount,
//           type: amount < 0 ? "expense" : "income",
//           date: new Date(r.Date || Date.now()),
//         });
//       }
//     }

//     // 🧩 Save to DB
//     if (transactions.length === 0) {
//       return res.status(400).json({ message: "No transactions found in file" });
//     }

//     await Transaction.insertMany(transactions);
//     res.status(200).json({
//       message: "File analyzed successfully ✅",
//       transactionsAdded: transactions.length,
//     });
//   } catch (err) {
//     console.error("❌ Error processing file:", err);
//     res.status(500).json({ message: "Error processing file" });
//   } finally {
//     // delete uploaded file after processing
//     fs.unlink(req.file.path, () => {});
//   }
// };
