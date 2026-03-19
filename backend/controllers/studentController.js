const Student = require("../models/Student");
const StudentDocuments = require("../models/StudentDocuments");

const extractAadharNumber = require("../utils/aadharOCR");
const path = require("path");

const studentLogin = async (req, res) => {
  const { prn, name, mobile, password } = req.body;

  try {
    const student = await Student.findOne({
      prn,
      name,
      mobile,
      password
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Student record not found. Check details."
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      student
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const uploadDocuments = async (req, res) => {
  console.log("FILES RECEIVED:", req.files);

  try {

    const { studentId, fromStation, aadharNumber, category } = req.body;

    const existingApplication = await StudentDocuments.findOne({
      studentId,
      academicYear: "2025-2026"
    });

    if (existingApplication) {

      if (existingApplication.status === "PENDING") {
        return res.status(400).json({
          success: false,
          message: "Your documents are under review"
        });
      }

      if (existingApplication.status === "APPROVED") {
        return res.status(400).json({
          success: false,
          message: "Documents already approved. You cannot upload again."
        });
      }
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Caste validation
    if (
      (student.caste === "Open" || student.caste === "OBC") &&
      category === "SCST"
    ) {
      return res.status(400).json({
        success: false,
        message: "You are not eligible for SC/ST category"
      });
    }

    if (category === "SCST" && !req.files["casteCertificate"]) {
      return res.status(400).json({
        success: false,
        message: "Caste certificate required for SC/ST"
      });
    }

    // -------- OCR Aadhaar Verification --------

    const aadharFilePath = path.join(
      __dirname,
      "../uploads/documents",
      req.files["aadhar"][0].filename
    );

    const extractedAadhar = await extractAadharNumber(aadharFilePath);

    if (!extractedAadhar || extractedAadhar !== student.aadhar) {
      return res.status(400).json({
        success: false,
        message: "Uploaded Aadhaar does not match student records"
      });
    }

    // -------- Save documents --------

    const documents = new StudentDocuments({

      studentId,
      academicYear: "2025-2026",
      category,
      fromStation,
      aadharNumber,

      aadharFile: req.files["aadhar"][0].filename,
      electricityBillFile: req.files["electricity"][0].filename,

      casteCertificateFile:
        category === "SCST"
          ? req.files["casteCertificate"][0].filename
          : null

    });

    await documents.save();
    // Save fromStation to student profile (only if not already set)
    if (!student.fromStation) {
      await Student.findByIdAndUpdate(studentId, { fromStation });
    }

    res.json({
      success: true,
      message: "Documents uploaded successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const StudentNotification = require("../models/StudentNotification");


const getStudentNotifications = async (req,res)=>{

  try{

    const notifications = await StudentNotification.find({
      student_id:req.params.studentId
    });

    res.json(notifications);

  }catch(error){

    res.status(500).json({message:"Error fetching notifications"});

  }

};


const markStudentNotificationRead = async (req,res)=>{

  try{

    const updated = await StudentNotification.findByIdAndUpdate(
      req.params.id,
      {view:"read"},
      {new:true}
    );

    res.json(updated);

  }catch(error){

    res.status(500).json({message:"Error updating notification"});

  }

};

// ADD downloadConcessionPDF controller
const generateConcessionPDF = require("../utils/generateConcessionPDF");

const downloadConcessionPDF = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const record = await StudentDocuments.findOne({ studentId, status: "ACTIVE" });
    if (!record || record.concessionStatus !== "COMPLETED") {
      return res.status(400).json({ success: false, message: "No concession applied yet" });
    }

    // ── Calculate age from DOB ──
    const [dd, mm, yyyy] = student.dob.split("/").map(Number);
    const birth = new Date(yyyy, mm - 1, dd);
    const today = new Date();
    let ageYears = today.getFullYear() - birth.getFullYear();
    if (today < new Date(today.getFullYear(), mm - 1, dd)) ageYears--;

    const pdfBytes = await generateConcessionPDF({
      name:           student.name,                    // ✅ was studentName
      dob:            student.dob,                     // ✅ same
      classVal:       record.travelClass,              // ✅ was travelClass
      period:         record.period,
      ageYears:       calculateAge(student.dob),
      fromStation:    record.fromStation,// ✅ was missing entirely
      prevCertNo:     record.prevTicketNo,             // ✅ was prevTicketNo
      lastTicketUpto: record.ticketExpiry,             // ✅ was ticketExpiry
      seasonTicketNo: record.seasonTicketNo,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=ConcessionForm_${student.name.replace(/ /g, "_")}.pdf`);
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};  
 
// ── Helper: calculate age from DOB string (DD/MM/YYYY) ───────────────────────
// ✅ Handle both formats: "2007-04-16" AND "16/04/2007"
function calculateAge(dobStr) {
  let birth;
  if (dobStr.includes("-")) {
    // YYYY-MM-DD format
    birth = new Date(dobStr);
  } else {
    // DD/MM/YYYY format
    const [dd, mm, yyyy] = dobStr.split("/").map(Number);
    birth = new Date(yyyy, mm - 1, dd);
  }
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  return String(age);
}
 
// ── POST /api/student/apply-concession ───────────────────────────────────────
const applyConcession = async (req, res) => {
  try {
    const {
      studentId,
      period,
      travelClass,
      prevTicketNo,
      seasonTicketNo,
      ticketExpiry,
      appDate
    } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "studentId is required" });
    }

    // Save concession details to StudentDocuments record
    const updated = await StudentDocuments.findOneAndUpdate(
      { studentId, status: "ACTIVE" },
      {
        period,
        travelClass,
        prevTicketNo,
        seasonTicketNo,
        ticketExpiry,
        appDate,
        concessionStatus: "COMPLETED"
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "No active document record found" });
    }

    res.json({ success: true, message: "Concession applied successfully" });

  } catch (error) {
    console.error("Concession error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyConcession = async (req, res) => {
  try {
    const { studentId } = req.params;

    const record = await StudentDocuments.findOne({ 
      studentId, 
      status: "ACTIVE"  // 👈 add this filter
    });

    if (!record) {
      return res.status(404).json({ success: false, message: "No concession record found" });
    }

    res.status(200).json({ success: true, data: record });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};  

const getDocumentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get the ACTIVE record first, fallback to latest
    const record = await StudentDocuments.findOne({ 
      studentId, 
      status: "ACTIVE" 
    });

    if (!record) {
      // Check if there's any record at all
      const latest = await StudentDocuments.findOne({ studentId })
        .sort({ createdAt: -1 });
      
      return res.json({ 
        status: latest ? latest.status : "NOT_FOUND",
        concessionStatus: latest ? latest.concessionStatus : null
      });
    }

    res.json({ 
      status: record.status, 
      concessionStatus: record.concessionStatus 
    });

  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};

module.exports = {
  studentLogin,
  uploadDocuments,
  applyConcession,
  getMyConcession, 
  downloadConcessionPDF, 
  getStudentNotifications,
  markStudentNotificationRead,
  getDocumentStatus
};