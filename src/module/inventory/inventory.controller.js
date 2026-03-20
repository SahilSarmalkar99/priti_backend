const ProductModel = require("../../model/product");
const InvoiceModel = require("../../model/invoice");
const Auth = require("../../model/auth"); 
const mongoose = require("mongoose");


async function addProduct(req, res) {
  try {
    const { name, category, price, supplier } = req.body;

    // 1️⃣ Validation
    if (!name || !category || !price) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    // 2️⃣ Check if product already exists
    const existingProduct = await ProductModel.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product already exists",
      });
    }

    // 3️⃣ Create product
    const product = await ProductModel.create(req.body);

    res.status(201).json({
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


async function purchaseProduct(req, res) {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity required",
      });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.stock += quantity;
    await product.save();

    res.json({
      message: "Stock updated",
      product,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


async function getLowStock(req, res) {
  try {
    const products = await ProductModel.find({
      $expr: { $lt: ["$stock", "$minStock"] },
    });

    res.json(products);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


async function getAllProducts(req, res) {
  try {
    const products = await ProductModel.find().populate("supplier");

    res.json(products);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


async function createInvoice(req, res) {
  try {
    const { items, customerName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Items required",
      });
    }

    let totalAmount = 0;
    const invoiceItems = [];

    for (let item of items) {

      // ✅ Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const product = await ProductModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // 🔻 Reduce stock
      product.stock -= item.quantity;
      await product.save();

      const total = product.price * item.quantity;
      totalAmount += total;

      invoiceItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const invoice = await InvoiceModel.create({
      invoiceNumber: "INV-" + Date.now(),
      customerName,
      items: invoiceItems,
      totalAmount,
      createdBy: req.user?.id || null, // ✅ safe fallback
    });

    res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


async function getInvoices(req, res) {
  try {
    const invoices = await InvoiceModel.find()
      .populate("items.product")
      .populate("createdBy", "username email");

    res.json(invoices);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


async function deleteProduct(req, res) {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, category, price, supplier, stock, minStock } = req.body;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // ✅ Check product exists
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ✅ Update fields (only if provided)
    if (name) product.name = name;
    if (category) product.category = category;
    if (price !== undefined) product.price = price;
    if (supplier) product.supplier = supplier;
    if (stock !== undefined) product.stock = stock;
    if (minStock !== undefined) product.minStock = minStock;

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  addProduct,
  purchaseProduct,
  getLowStock,
  getAllProducts,
  createInvoice,
  getInvoices,
  deleteProduct,
  updateProduct
};