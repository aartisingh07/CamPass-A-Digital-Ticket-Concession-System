import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Components Files/navbar.css";

function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {

      // Close profile dropdown
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpen(false);
      }

      // Close notification dropdown
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef, notifRef]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("student");

    navigate("/student-login", { replace: true });
  };

  const [student, setStudent] = useState(null);
  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));
    if (storedStudent) {
      setStudent(storedStudent);
    }
  }, []);


  useEffect(() => {

  const student = JSON.parse(localStorage.getItem("student"));
    if (!student) return;

    fetch(`http://localhost:5000/api/students/notifications/${student._id}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(n => ({
          id: n._id,
          text: n.message,
          read: n.view === "read"
        }));
        setNotifications(formatted);
      })
      .catch(() => setNotifications([]));

  }, []);

  return (
    <div className="top-header">
      {/* LEFT */}
      <div className="header-left">
        {/* ☰ HAMBURGER FIRST */}
        <span className="hamburger" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </span>

        {/* CamPass BRAND (MOBILE ONLY) */}
        <div className="header-brand">
          <i className="fa-solid fa-graduation-cap"></i>
          <span>CamPass</span>
        </div>

        {/* DESKTOP ONLY */}
        <span className="header-title">User Dashboard</span>
      </div>

      {/* RIGHT */}
      <div className="header-right">

        <div className="notification-wrapper" ref={notifRef}>
        <div className="bell-icon" onClick={(e) => {e.stopPropagation();setNotifOpen(prev => !prev);
          setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
          );
        }}>
          <span className="icon" onClick={()=>navigate("/dashboard/notifications")}>🔔</span>

          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </div>

        {notifOpen && (
          <div className="notif-dropdown">
            <h4>Notifications</h4>

            {notifications.length === 0 ? (
              <p className="no-notif">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? "unread" : ""}`}
                >
                  {n.text}
                </div>
              ))
            )}
          </div>
        )}
      </div>
        <span className="header-divider"></span>

        <div
          className="profile-wrapper"
          ref={profileRef}
          onClick={(e) => {e.stopPropagation();setOpen(prev => !prev);}}
        >
          <div className="profile-icon-circle">
            <i className="fa-solid fa-user"></i>
          </div>

          {open && (
            <div className="dropdown">
              {student && (
                <div
                  className="profile-info"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    navigate("/dashboard/profile");
                  }}
                >
                  <strong>{student.name}</strong>
                  <p>PRN: {student.prn}</p>
                </div>
              )}

              <div className="dropdown-divider"></div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;