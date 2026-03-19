const express = require("express");
const router = express.Router();

const {
  studentLogin,
  uploadDocuments,
  applyConcession,
  getMyConcession,          // ← ADD
  downloadConcessionPDF,    // ← ADD
  getStudentNotifications,
  markStudentNotificationRead
} = require("../controllers/studentController");

const upload = require("../config/uploadDocuments");
const StudentDocuments = require("../models/StudentDocuments");

router.post("/apply-concession", protect, applyConcession);
router.get("/my-concession/:studentId", getMyConcession);
router.get("/download-concession-pdf/:studentId", downloadConcessionPDF);

// Student Notifications
router.get("/notifications/:studentId", getStudentNotifications);
router.put("/notifications/read/:id", markStudentNotificationRead);

// Student Login
router.post("/login", studentLogin);

// Upload Documents
router.post(
  "/upload-documents",
  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "electricity", maxCount: 1 },
    { name: "casteCertificate", maxCount: 1 }
  ]),
  uploadDocuments
);

// Apply Concession
router.post("/apply-concession", applyConcession);

// Check Document Status
router.get("/document-status/:studentId", async (req, res) => {

  try {

    const record = await StudentDocuments.findOne({
      studentId: req.params.studentId,
      academicYear: "2025-2026"
    });

    if (!record) {
      return res.json({ status: "NOT_UPLOADED" });
    }

    // Ticket expiry logic
    if (record.concessionExpiry && new Date() > record.concessionExpiry) {
      record.concessionStatus = "NOT_APPLIED";
      await record.save();
    }

    res.json({
      status: record.status,
      concessionStatus: record.concessionStatus
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

module.exports = router;