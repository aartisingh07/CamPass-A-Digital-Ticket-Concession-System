const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  admin_pnr: { type: String, unique: true },
  name: String,
  email: String,
  phone: String,
  role: String,
  password: String
});

module.exports = mongoose.model("Admin", adminSchema);