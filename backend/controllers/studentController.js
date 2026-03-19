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
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const record = await StudentDocuments.findOne({ studentId });
    if (!record || record.concessionStatus !== "COMPLETED") {
      return res.status(400).json({ success: false, message: "No concession applied yet" });
    }

    const pdfBytes = await generateConcessionPDF({
      studentName:   student.name,
      dob:           student.dob,
      travelClass:   record.travelClass,
      period:        record.period,
      fromStation:   record.fromStation,
      prevTicketNo:  record.prevTicketNo,
      seasonTicketNo: record.seasonTicketNo,
      ticketExpiry:  record.ticketExpiry,
      appDate:       record.appDate
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ConcessionForm_${student.name.replace(/ /g, "_")}.pdf`
    );
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const { generateConcessionPDF } = require("../utils/generateConcessionPDF");
 
// ── Helper: calculate age from DOB string (DD/MM/YYYY) ───────────────────────
function calculateAge(dobStr) {
  const [dd, mm, yyyy] = dobStr.split("/").map(Number);
  const birth = new Date(yyyy, mm - 1, dd);
  const today = new Date();
  let years   = today.getFullYear() - birth.getFullYear();
  let months  = today.getMonth()    - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  return { years: String(years), months: String(months) };
}
 
// ── POST /api/student/apply-concession ───────────────────────────────────────
const applyConcession = async (req, res) => {
  try {
    const {
      name,
      classVal        = "II",
      period          = "Quarterly",
      fromStation,
      dob,                          // DD/MM/YYYY
      prevCertNo      = "NIL",
      lastTicketUpto  = "NIL",
      seasonTicketNo  = "NIL",
    } = req.body;
 
    // Basic validation
    if (!name || !fromStation || !dob) {
      return res.status(400).json({
        success: false,
        message: "name, fromStation and dob are required",
      });
    }
 
    const { years } = calculateAge(dob);
 
    // Generate the filled PDF buffer
    const pdfBuffer = await generateConcessionPDF({
      name,
      classVal,
      period,
      fromStation,
      ageYears:       years,
      dob,
      prevCertNo,
      lastTicketUpto,
      seasonTicketNo,
    });
 
    // Optional: save record to DB here
    // await ConcessionModel.create({ studentId: req.user._id, appliedAt: new Date(), ... });
 
    // Send PDF as download
    const filename = `Concession_${name.replace(/\s+/g, "_")}.pdf`;
    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length",      pdfBuffer.length);
    res.send(pdfBuffer);
 
  } catch (error) {
    console.error("Concession generation error:", error);
    res.status(500).json({ success: false, message: "Failed to generate concession form" });
  }
};

module.exports = {
  studentLogin,
  uploadDocuments,
  applyConcession,
  getMyConcession, 
  downloadConcessionPDF, 
  getStudentNotifications,
  markStudentNotificationRead
};