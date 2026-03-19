const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getNotifications,
  getUnreadCount,
  markAsRead,
  getApplications,
  getApprovedStudents,
  approveApplication,
  rejectApplication,
  undoApproval
} = require("../controllers/adminController");

console.log("Admin routes loaded");

router.get("/test", (req, res) => {
  res.send("Admin route working");
});

router.post("/login", adminLogin);

router.get("/notifications/:adminId", getNotifications);
router.get("/notifications/unread/:adminId", getUnreadCount);
router.put("/notifications/read/:id", markAsRead);

router.get("/approved-students", getApprovedStudents);
router.put("/application/approve/:id", approveApplication);
router.put("/application/reject/:id", rejectApplication);
router.post("/undo-approval/:id", undoApproval);

// Admin dashboard applications
router.get("/applications", getApplications);

module.exports = router;