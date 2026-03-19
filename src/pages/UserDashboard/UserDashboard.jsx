import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import concessionImg from "../../assets/concession.png";

import DashboardCard from "../../components/DashboardCard";

function UserDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1️⃣ Clear auth data (future proof)
    localStorage.removeItem("user");     // or token later
    localStorage.removeItem("role");

    // 2️⃣ Redirect to login page
    navigate("/login", { replace: true });
  };

  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    if (student) {
      setStudentName(student.name);
    }
  }, []);

  return (
    <>
      {/* DASHBOARD HOME */}
      {activeSection === "dashboard" && (
        <>
          <h2 className="welcome-text">Welcome, {studentName} 👋</h2>

          <div className="dashboard-box">
            <div className="card-grid">
              <DashboardCard
                title="Upload Documents"
                image="/assets/documents.png"
              />

              <DashboardCard
                title="Apply for Railway Concession"
                image="/assets/train.png"
              />
              
              <DashboardCard
                title="Concession Form"
                image={concessionImg}
              />
            </div>

            <div className="info-box">
              ⚠️ <strong>First Step Required:</strong> Please upload your documents before applying for a railway concession.
            </div>
          </div>
        </>
      )}

      {/* NOTIFICATIONS */}
      {activeSection === "notifications" && (
        <>
          <h2>Notifications</h2>
          <p>No new notifications yet.</p>
        </>
      )}

      {/* MY CONCESSION */}
      {activeSection === "concession" && (
        <>
          <h2>My Concession</h2>
          <p>Your concession status will appear here.</p>
        </>
      )}
    </>
  );
}

export default UserDashboard;