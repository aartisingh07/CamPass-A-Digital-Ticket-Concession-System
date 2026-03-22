const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  prn: { type: String, unique: true },
  branch: String,
  year: { type: Number, default: 1 }, // 1, 2, 3, or 4
  mobile: String,
  password: String,
  aadhar: String,
  caste: String,
  dob: String,           // ← ADD THIS
  fromStation: String,   // ← ADD THIS
  address: {
    city: String,
    pincode: String
  }
});

module.exports = mongoose.model("Student", studentSchema);