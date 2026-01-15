import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { handleFileUpload } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), handleFileUpload);

export default router;

// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import multer from "multer";
// import { handleFileUpload } from "../controllers/uploadController.js";

// const router = express.Router();

// // Multer storage WITH ORIGINAL EXTENSION
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const allowed = ["pdf", "csv", "xlsx", "xls"];
//     const ext = file.originalname.split(".").pop().toLowerCase();
//     if (!allowed.includes(ext)) {
//       return cb(new Error("Invalid file type"));
//     }
//     cb(null, true);
//   },
// });


// // route
// router.post("/", authMiddleware, upload.single("file"), handleFileUpload);

// export default router;
