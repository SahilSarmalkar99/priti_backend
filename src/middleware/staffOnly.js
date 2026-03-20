function staffOnly(req, res, next) {
  try {
    // ✅ Check if user exists (auth middleware must run before this)
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ Check role
    if (req.user.role !== "Staff") {
      return res.status(403).json({
        message: "Access Denied: Staff Only",
      });
    }

    next();

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = staffOnly;