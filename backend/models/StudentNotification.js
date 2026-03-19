const mongoose = require("mongoose");

const studentNotificationSchema = new mongoose.Schema({

  student_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Student"
  },

  message:String,

  view:{
    type:String,
    default:"unread"
  },

  date:String,
  time:String

});

module.exports = mongoose.model("StudentNotification",studentNotificationSchema);