const jwt = require("jsonwebtoken");

const isManager = (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Check cookies if no header
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3️⃣ No token
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token",
      });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 5️⃣ Check role
    if (decoded.role.toLowerCase() !== "manager") {
      return res.status(403).json({
        message: "Access Denied - Manager only",
      });
    }

    // 6️⃣ Attach user
    req.user = decoded;

    next();
  } catch (error) {
    console.log("isManager Error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = isManager;