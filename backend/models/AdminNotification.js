const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  date: {
    type: String
  },

  time: {
    type: String
  },

  view: {
    type: String,
    enum: ["read", "unread"],
    default: "unread"
  }

}, { timestamps: true });

module.exports = mongoose.model("AdminNotification", adminNotificationSchema);