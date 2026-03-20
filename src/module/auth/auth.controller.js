const authModel = require("../../model/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    console.log("🔹 LOGIN API HIT");
    console.log("📦 BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    console.log("🔍 Checking user in DB...");
    const user = await authModel.findOne({ email });
    console.log("✅ DB RESPONSE:", user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("🔐 Comparing password...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    console.log("🎟 Generating token...");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    console.log("🍪 Setting cookie...");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    console.log("✅ LOGIN SUCCESS");

    res.status(200).json({
      message: "User logged in",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("🔥 LOGIN ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function register(req, res) {
  try {
    console.log("🔹 REGISTER API HIT");
    console.log("📦 BODY:", req.body);

    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      console.log("❌ Missing fields");
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    console.log("🔍 Checking existing user...");
    const oldUser = await authModel.findOne({ email });
    console.log("✅ Existing user:", oldUser);

    if (oldUser) {
      console.log("❌ User already exists");
      return res.status(400).json({
        message: "User already exists",
      });
    }

    console.log("🔐 Hashing password...");
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    console.log("💾 Creating user...");
    const newUser = await authModel.create({
      username,
      email,
      password: hashPassword,
      role,
    });

    console.log("✅ User created:", newUser);

    console.log("🎟 Generating token...");
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    console.log("🍪 Setting cookie...");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    console.log("🎉 REGISTER SUCCESS");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.log("🔥 REGISTER ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function logout(req, res) {
  try {
    console.log("🔹 LOGOUT API HIT");

    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      expires: new Date(0), // expire immediately
    });

    console.log("✅ LOGOUT SUCCESS");

    res.status(200).json({
      message: "User logged out successfully",
    });

  } catch (error) {
    console.log("🔥 LOGOUT ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
module.exports = { login, register ,logout};