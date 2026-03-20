const SupplierModel = require("../../model/supplier");

async function add(req, res) {
  try {
    const { name, email, address, phone } = req.body;

    const oldSupplier = await SupplierModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (oldSupplier) {
      return res.status(400).json({
        message: "Already Exists",
      });
    }

    const newSupplier = await SupplierModel.create({
      name,
      email,
      phone,
      address,
    });

    res.status(200).json({
      message: "New Supplier Added",
      supplier: newSupplier,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ineternal Server Error",
    });
  }
}
async function display(req, res) {
  try {
    const suppliers = await SupplierModel.find();
    res.json(suppliers);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ineternal Server Error",
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const supplier = await SupplierModel.findById(id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    if (email) supplier.email = email.toLowerCase();
    if (name) supplier.name = name;
    if (phone) supplier.phone = phone;
    if (address) supplier.address = address;

    await supplier.save();

    res.json({
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const supplier = await SupplierModel.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {add , display , update , remove}