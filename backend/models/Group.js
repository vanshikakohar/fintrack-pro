// backend/models/Group.js
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  members: {
    type: [memberSchema],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Group", groupSchema);















// // backend/models/Group.js
// import mongoose from "mongoose";

// const memberSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String },
//   },
//   { _id: false }
// );

// const groupSchema = new mongoose.Schema({
//   // ✅ OWNER OF GROUP
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   name: {
//     type: String,
//     required: true,
//   },

//   members: {
//     type: [memberSchema],
//     default: [],
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.model("Group", groupSchema);






















// // backend/models/Group.js
// import mongoose from "mongoose";

// const memberSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String }
// }, { _id: false });

// const groupSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   members: { type: [memberSchema], default: [] },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("Group", groupSchema);







// import mongoose from "mongoose";

// const memberSchema = new mongoose.Schema({
//   name: { type: String, required: true },        // or userId if you have users
//   email: { type: String }                        // optional
// }, { _id: false });

// const groupSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   members: { type: [memberSchema], default: [] },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("Group", groupSchema);
