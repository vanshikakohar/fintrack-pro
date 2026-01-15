import mongoose from "mongoose";
const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
    month: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);


// import mongoose from "mongoose";

// const budgetSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     month: {
//       type: String,
//       required: true, // Example: "November 2025"
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     limit: {
//       type: Number,
//       required: true,
//     },
//     spent: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Budget", budgetSchema);
