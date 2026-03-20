const express = require("express");
const inventoryController = require("./inventory.controller");
const routes = express.Router();
const isManager = require("../../middleware/supplier.middleware");

routes.post("/add",  inventoryController.addProduct);

routes.get("/display", inventoryController.getAllProducts);

routes.get("/low-stock", inventoryController.getLowStock);

routes.delete("/delete/:id",  inventoryController.deleteProduct);

routes.put("/update/:id", inventoryController.updateProduct);

routes.post("/invoice", inventoryController.createInvoice);

routes.get("/invoice", inventoryController.getInvoices);

module.exports = routes;