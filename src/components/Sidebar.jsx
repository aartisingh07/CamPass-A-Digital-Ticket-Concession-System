import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Components Files/sidebar.css";

function Sidebar({ closeSidebar }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.innerWidth <= 768) {
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
          <NavLink to="/dashboard" end onClick={handleClick}>
            <i className="fa-solid fa-table-columns"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/upload" onClick={handleClick}>
            <i className="fa-solid fa-upload"></i>
            <span>Upload Documents</span>
        </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/apply" onClick={handleClick}>
            <i className="fa-solid fa-file-signature"></i>
            <span>Apply for Concession</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/concession" onClick={handleClick}>
            <i className="fa-solid fa-id-card"></i>
            <span>My Concession</span>
        </NavLink>
        </li>
      </ul>

      {/* BACK TO HOME */}
      <div className="sidebar-bottom">
        <button
          className="back-home-btn"
          onClick={() => {
            localStorage.removeItem("student"); // clear session
            navigate("/", { replace: true });
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Home
        </button>
      </div>

    </div>
  );
}

export default Sidebar;