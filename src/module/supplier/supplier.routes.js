const express = require("express");
const supplierController = require("./supplier.controller");
const routes = express.Router();
const isManager = require("../../middleware/supplier.middleware");

routes.post("/add" , isManager , supplierController.add);
routes.put("/update/:id",  isManager, supplierController.update);
routes.delete("/delete/:id",  isManager, supplierController.remove);
routes.get("/display" , supplierController.display);

module.exports = routes;