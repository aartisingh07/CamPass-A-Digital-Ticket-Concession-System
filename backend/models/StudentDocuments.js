const mongoose = require("mongoose");

const studentDocumentsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  academicYear: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["OPEN", "SCST"],
    required: true
  },

  aadharNumber: {
    type: String,
    required: true
  },

  fromStation: {
    type: String,
    required: true
  },

  aadharFile: {
    type: String,
    required: true
  },

  electricityBillFile: {
    type: String,
    required: true
  },

  casteCertificateFile: {
    type: String,
    default: null
  },

  status: {
    type: String,
    enum: ["PENDING", "ACTIVE", "REJECTED"],
    default: "PENDING"
  },

  concessionStatus: {
    type: String,
    enum: ["NOT_APPLIED", "COMPLETED"],
    default: "NOT_APPLIED"
  },

  concessionExpiry: {
    type: Date,
    default: null
  },
  // Add these fields to studentDocumentsSchema
  travelClass: {
    type: String,
    default: null
  },
  period: {
    type: String,
    default: null
  },
  prevTicketNo: {
    type: String,
    default: null
  },
  seasonTicketNo: {
    type: String,
    default: null
  },
  ticketExpiry: {
    type: String,
    default: null
  },
  appDate: {
    type: String,
    default: null
  },
  undoAvailableUntil: {
    type: Date,
    default: null
  },

  archived: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });
module.exports = mongoose.model("StudentDocuments", studentDocumentsSchema);