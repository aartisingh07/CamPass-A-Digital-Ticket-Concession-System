
const Admin = require("../models/Admin");
const AdminNotification = require("../models/AdminNotification");

const adminLogin = async (req, res) => {
  const { admin_pnr, email, password } = req.body;

  try {

    const admin = await Admin.findOne({
      admin_pnr,
      email,
      password
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Admin Credentials"
      });
    }

    res.json({
      success: true,
      message: "Admin Login Successful",
      admin
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// GET ALL NOTIFICATIONS
const getNotifications = async (req, res) => {

  const { adminId } = req.params;

  try {

    const notifications = await AdminNotification.find({
      admin_id: adminId
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching notifications"
    });

  }
};


// GET UNREAD COUNT
const getUnreadCount = async (req,res)=>{

  const { adminId } = req.params;

  try{

    const count = await AdminNotification.countDocuments({
      admin_id: adminId,
      view: "unread"
    });

    res.json({count});

  }catch(error){

    res.status(500).json({
      message:"Error fetching unread count"
    });

  }
};

const markAsRead = async (req,res)=>{

  try{

    const updated = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      { view:"read" },
      { new:true }
    );

    res.json(updated);

  }catch(error){

    console.error(error);

    res.status(500).json({
      message:"Error updating notification"
    });

  }

};

const StudentDocuments = require("../models/StudentDocuments");

const getApplications = async (req, res) => {
  try {
    const applications = await StudentDocuments
      .find()
      .populate("studentId");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};

const getApprovedStudents = async (req, res) => {
  try {

    const approved = await StudentDocuments.find({ status: "ACTIVE" })
      .populate("studentId");

    res.json(approved);

  } catch (error) {
    res.status(500).json({ message: "Error fetching approved students" });
  }
};

const StudentNotification = require("../models/StudentNotification");
const fs = require("fs");
const path = require("path");
const approveApplication = async (req, res) => {
  try {

    const application = await StudentDocuments.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const approvedTime = new Date();
    const undoLimit = new Date(approvedTime.getTime() + 48 * 60 * 60 * 1000);

    application.status = "ACTIVE";
    application.approvedAt = approvedTime;
    application.undoAvailableUntil = undoLimit;
    application.archived = true;

    await application.save();

    const uploadPath = path.join(__dirname, "../uploads/documents");
    const archivePath = path.join(__dirname, "../uploads/archive");

    if (!fs.existsSync(archivePath)) {
      fs.mkdirSync(archivePath);
    }

    const files = [
      application.aadharFile,
      application.electricityBillFile,
      application.casteCertificateFile
    ];

    files.forEach(file => {
      if (!file) return;

      const oldPath = path.join(uploadPath, file);
      const newPath = path.join(archivePath, file);

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    });

    await StudentNotification.create({
      student_id: application.studentId,
      message: "Your concession documents have been approved. You can now apply for concession.",
      view: "unread",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    });

    res.json({
      success: true,
      message: "Application approved. Undo available for 48 hours."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectApplication = async (req, res) => {

  try {

    const application = await StudentDocuments.findByIdAndUpdate(
      req.params.id,
      { status: "REJECTED" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success:false, message:"Application not found" });
    }

    await StudentNotification.create({
      student_id: application.studentId,
      message: "Your concession documents were rejected.",
      view: "unread",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    });

    res.json({
      success:true,
      message:"Application rejected"
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

const undoApproval = async (req, res) => {
  try {

    const application = await StudentDocuments.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (new Date() > application.undoAvailableUntil) {
      return res.status(400).json({
        success: false,
        message: "Undo period expired",
      });
    }

    application.status = "PENDING";
    application.archived = false;
    application.approvedAt = null;
    application.undoAvailableUntil = null;

    await application.save();

    const uploadPath = path.join(__dirname, "../uploads/documents");
    const archivePath = path.join(__dirname, "../uploads/archive");

    const files = [
      application.aadharFile,
      application.electricityBillFile,
      application.casteCertificateFile
    ];

    files.forEach(file => {
      if (!file) return;

      const oldPath = path.join(archivePath, file);
      const newPath = path.join(uploadPath, file);

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    });

    res.json({
      success: true,
      message: "Approval undone successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  getNotifications,
  getUnreadCount,
  markAsRead,
  getApplications,
  getApprovedStudents,
  approveApplication,
  rejectApplication,
  undoApproval
};