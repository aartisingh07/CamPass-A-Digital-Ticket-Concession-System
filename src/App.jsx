import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";

import DashboardLayout from "./layouts/DashboardLayout";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import UploadDocuments from "./pages/UserDashboard/UploadDocuments";
import Profile from "./pages/UserDashboard/Profile";
import ApplyConcession from "./pages/UserDashboard/ApplyConcession";
import MyConcession from "./pages/UserDashboard/MyConcession";

import StudentLogin from "./pages/Login/StudentLogin";
import AdminLogin from "./pages/Login/AdminLogin";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import StudentsList from "./pages/AdminDashboard/StudentsList";
import Reports from "./pages/AdminDashboard/Reports";
import AcademicCycleManagement from "./pages/AdminDashboard/AcademicCycleManagement";

import AdminHome from "./pages/AdminDashboard/AdminHome";

import ProtectedStudentRoute from "./routes/ProtectedStudentRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";

import StudentNotifications from "./pages/UserDashboard/StudentNotifications";
import AdminNotifications from "./pages/AdminDashboard/AdminNotifications";

function App() {
  return (
    <BrowserRouter>
    <ToastContainer position="top-right" autoClose={2000} />

      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH ROUTES */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* STUDENT DASHBOARD */}
        <Route path="/dashboard" element={<ProtectedStudentRoute><DashboardLayout /></ProtectedStudentRoute>}>
          <Route index element={<UserDashboard />} />
          <Route path="upload" element={<UploadDocuments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="apply" element={<ApplyConcession />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="concession" element={<MyConcession />} />
        </Route>

        {/* ADMIN DASHBOARD */}
        <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>}>
          <Route index element={<AdminHome />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="academic-cycle" element={<AcademicCycleManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;