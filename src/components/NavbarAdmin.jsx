import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/AdminDashboard/admin.css";

const NavbarAdmin = ({ toggleSidebar }) => {

  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminInfo, setAdminInfo] = useState(null);

  const dropdownRef = useRef();
  const navigate = useNavigate();
  

  /* ------------------------------
     CLOSE PROFILE DROPDOWN
  --------------------------------*/
  useEffect(() => {

    const handler = (e) => {

      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }

    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, []);

  useEffect(() => {

    const admin = JSON.parse(localStorage.getItem("admin"));

    if (admin) {
      setAdminInfo(admin);
    }

  }, []);

  /* ------------------------------
     LOGOUT FUNCTION
  --------------------------------*/
  const handleLogout = () => {

    toast.success("Logged out successfully 👋");

    localStorage.removeItem("admin");

    setTimeout(() => {
      navigate("/admin-login");
    }, 2000);

  };

  /* ------------------------------
     FETCH UNREAD NOTIFICATIONS COUNT
  --------------------------------*/
  useEffect(() => {

    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!admin) return;

    const fetchUnread = () => {

      fetch(`http://localhost:5000/api/admin/notifications/unread/${admin._id}`)
        .then(res => res.json())
        .then(data => setUnreadCount(data.count))
        .catch(() => setUnreadCount(0));

    };

    

    fetchUnread();

    const interval = setInterval(fetchUnread, 3000); // refresh every 3 sec

    return () => clearInterval(interval);

  }, []);

  /* ------------------------------
     UI
  --------------------------------*/
  return (

    <div className="admin-navbar">

      <div className="nav-left">
        {/* ☰ HAMBURGER */}
        {toggleSidebar && (
          <span className="hamburger" onClick={toggleSidebar} style={{ marginRight: '15px', cursor: 'pointer', fontSize: '20px' }}>
            <i className="fa-solid fa-bars"></i>
          </span>
        )}
        <i className="fa-solid fa-school" style={{ marginRight: '10px', fontSize: '20px' }}></i>
        <span className="header-title">Admin Dashboard</span>
      </div>

      <div className="nav-right">

        {/* 🔔 NOTIFICATIONS */}
        <div className="notification-container">

          <i
            className="fas fa-bell"
            onClick={() => navigate("/admin-dashboard/notifications")}
          ></i>

          {unreadCount > 0 && (
            <span className="notification-count">
              {unreadCount}
            </span>
          )}

        </div>

        {/* 👤 PROFILE */}
        <div className="profile-container" ref={dropdownRef}>

          <div
            className="profile-toggle"
            onClick={() => setOpen(!open)}
          >

            <i className="fas fa-user-circle" style={{ fontSize: 28 }}></i>
            <i className="fas fa-chevron-down small-arrow"></i>

          </div>

          {open && (

            <div className="profile-dropdown">

              <div className="dropdown-header">

                <i className="fas fa-user-circle admin-icon"></i>

                <div className="admin-details">
                  <div className="admin-name">Admin</div>
                  <div className="admin-prn">PRN: {adminInfo?.admin_pnr}</div>
                  <div className="admin-email">{adminInfo?.email}</div>
                </div>

              </div>

              <div
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default NavbarAdmin;