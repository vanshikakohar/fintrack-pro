import express from "express";
import Document from "../models/Document.js";
import Transaction from "../models/Transaction.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL USER DOCUMENTS
router.get("/", auth, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(docs);
  } catch (err) {
    console.error("DOC FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

// DELETE DOCUMENT + ITS TRANSACTIONS
router.delete("/:id", auth, async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!doc) return res.status(404).json({ message: "Document not found" });

    await Transaction.deleteMany({ documentId: doc._id });
    await doc.deleteOne();

    res.json({ message: "Document and transactions removed" });
  } catch (err) {
    console.error("DOC DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
