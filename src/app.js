const express = require("express");
const CookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("../src/module/auth/auth.routes");
const supplierRoutes = require("../src/module/supplier/supplier.routes");
const inventoryRoutes = require("../src/module/inventory/inventory.routes");

const app = express();

// ✅ DEBUG: confirm file loaded
console.log("✅ APP.JS LOADED");

// ✅ middleware
app.use(express.json());
app.use(CookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173" , "http://localhost:5174" , "http://localhost:5175"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.url);
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/product", inventoryRoutes);

module.exports = app;