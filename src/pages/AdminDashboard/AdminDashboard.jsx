import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import SidebarAdmin from "../../components/SidebarAdmin";
import "../../styles/AdminDashboard/admin.css";
import "../../styles/UserDashboard/dashboard.css";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <SidebarAdmin closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* MAIN */}
      <div className="dashboard-main">
        {/* NAVBAR */}
        <NavbarAdmin toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* THIS IS IMPORTANT */}
        <div className="dashboard-content">
          <Outlet />
          
          {/* COPYRIGHT */}
          <div className="footer-bottom" style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
            © 2026 CamPass • Version 1.0
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;