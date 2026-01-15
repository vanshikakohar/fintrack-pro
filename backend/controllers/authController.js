import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * =========================
 * REGISTER USER
 * =========================
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * LOGIN USER
 * =========================
 */
export const loginUser = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.password) {
      return res
        .status(500)
        .json({ message: "User password missing in database" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * GET USER PROFILE
 * =========================
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * UPDATE USER PROFILE
 * =========================
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.occupation = req.body.occupation || user.occupation;
    user.monthlyIncome = req.body.monthlyIncome || user.monthlyIncome;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      occupation: updatedUser.occupation,
      monthlyIncome: updatedUser.monthlyIncome,
    });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // ✅ Register User
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({ name, email, password: hashedPassword });

//     res.status(201).json({ message: "User registered successfully", user });
//   } catch (error) {
//     console.error("❌ Error in registerUser:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Login User (your debug version)
// export const loginUser = async (req, res) => {
//   try {
//     console.log("📩 Login request received:", req.body);

//     const { email, password } = req.body;
//     if (!email || !password) {
//       console.log("❌ Missing email or password");
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("❌ User not found:", email);
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("🔍 Password match:", isMatch);

//     if (!isMatch) {
//       console.log("❌ Invalid credentials for", email);
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     if (!process.env.JWT_SECRET) {
//       console.error("❌ Missing JWT_SECRET in .env");
//       return res.status(500).json({ message: "Missing JWT_SECRET" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     console.log("✅ Login successful:", user.email);
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: { _id: user._id, name: user.name, email: user.email },
//     });
//   } catch (error) {
//     console.error("❌ Error in loginUser:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
