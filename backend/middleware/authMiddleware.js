// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // ✅ No token
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!process.env.JWT_SECRET) {
//       console.error("❌ JWT_SECRET missing");
//       return res.status(500).json({ message: "Server misconfiguration" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ IMPORTANT: normalize req.user
//     req.user = { id: decoded.id };

//     next();
//   } catch (error) {
//     console.error("❌ Auth Middleware Error:", error.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// export default authMiddleware;

import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;

