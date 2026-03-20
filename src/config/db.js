const mongoose = require("mongoose");

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected Successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = ConnectDB;