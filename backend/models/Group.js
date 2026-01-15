// backend/models/Group.js
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String }
}, { _id: false });

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: { type: [memberSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Group", groupSchema);
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
