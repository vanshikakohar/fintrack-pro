// import mongoose from "mongoose";

// const transactionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     accountId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Account",
//       required: true,
//     },

//     type: {
//       type: String,
//       enum: ["income", "expense"],
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       lowercase: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     date: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model(
//   "Transaction",
//   transactionSchema
// );

import mongoose from "mongoose";

const transactionSchema =
  new mongoose.Schema(
    {
      // ✅ USER
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // ✅ OPTIONAL ACCOUNT
      accountId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: false,
      },

      // ✅ TYPE
      type: {
        type: String,
        enum: [
          "income",
          "expense",
        ],
        required: true,
      },

      // ✅ AMOUNT
      amount: {
        type: Number,
        required: true,
      },

      // ✅ CATEGORY
      category: {
        type: String,
        required: true,
        lowercase: true,
      },

      // ✅ DESCRIPTION
      description: {
        type: String,
        default: "",
      },

      // ✅ OPTIONAL DOCUMENT
      documentId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },

      // ✅ DATE
      date: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Transaction",
  transactionSchema
);

// import mongoose from "mongoose";

// const transactionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["income", "expense"],
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     category: {
//   type: String,
//   required: true,
//   lowercase: true
// },
// documentId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Document",
// },


//     description: {
//       type: String,
//       default: "",
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Transaction", transactionSchema);

// import mongoose from "mongoose";

// const transactionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     accountId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Account",
//     },

//     type: {
//       type: String,
//       enum: ["income", "expense"],
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       lowercase: true,
//     },

//     documentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Document",
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     date: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Transaction", transactionSchema);