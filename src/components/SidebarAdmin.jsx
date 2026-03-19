import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Components Files/sidebar.css";

const SidebarAdmin = ({ closeSidebar }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.innerWidth <= 768 && closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <div className="sidebar">
      {/* LOGO */}
      <div className="sidebar-header">
        <i className="fa-solid fa-graduation-cap sidebar-logo-icon"></i>
        <span className="sidebar-title">CamPass</span>
      </div>

      {/* MENU */}
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin-dashboard" end onClick={handleClick}>
            <i className="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/students" onClick={handleClick}>
            <i className="fas fa-check-circle"></i>
            <span>Approved Students List</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/academic-cycle" onClick={handleClick}>
            <i className="fas fa-layer-group"></i>
            <span>Academic Cycle Management</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/reports" onClick={handleClick}>
            <i className="fas fa-file-alt"></i>
            <span>Academic Reports</span>
          </NavLink>
        </li>
      </ul>

      {/* BACK TO HOME */}
      <div className="sidebar-bottom">
        <button
          className="back-home-btn"
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;