import React from "react";
import "../../styles/AdminDashboard/admin.css";

const AcademicCycleManagement = () => {
  return (
    <div className="main-content">

      <h2 className="page-title">Academic Cycle Management</h2>

      {/* Current Academic Year Control */}
      <div className="card-section">
        <h3>Current Academic Year Control</h3>

        <div className="year-row">
          <label>Semester:</label>
          <select>
            <option>Choose Semester</option>
            <option>1st Semester</option>
            <option>2nd Semester</option>
            <option>3rd Semester</option>
            <option>4th Semester</option>
            <option>5th Semester</option>
            <option>6th Semester</option>
            <option>7th Semester</option>
            <option>8th Semester</option>
          </select>
        </div>

        <div className="date-row">
          <div>
            <label>Academic Start Date:</label>
            <input type="date" />
          </div>

          <div>
            <label>Academic End Date:</label>
            <input type="date" />
          </div>

          <div>
            <label>Re-Registration Opening:</label>
            <input type="date" />
          </div>
        </div>

        <div className="button-row">
          <button className="freeze-btn">Freeze All Accounts</button>
          <button className="start-btn">Start Re-Registration</button>
        </div>

        <div className="warning-box">
          ⚠ Freezing cannot be reversed.
        </div>
      </div>

      {/* Freeze History */}
      <div className="card-section">
        <h3>Freeze History</h3>

        <table>
          <thead>
            <tr>
              <th>Academic Year</th>
              <th>Freeze Date</th>
              <th>Re-Registration Start</th>
              <th>Re-Registration End</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2024–2025</td>
              <td>06/4/2024</td>
              <td>07/05/2024</td>
              <td>07/20/2024</td>
              <td className="completed">Completed</td>
            </tr>
            <tr>
              <td>2023–2024</td>
              <td>07/02/2023</td>
              <td>07/08/2023</td>
              <td>07/25/2023</td>
              <td className="completed">Completed</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* System Safeguards */}
      <div className="card-section safeguards">
        <h3>System Safeguards</h3>

        <div className="safeguard-grid">
          <div className="safeguard-card">
            <div className="icon-circle">
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="safeguard-text">
              <h4>Auto Reminder Before Academic End</h4>
              <p>Automatic alerts as the academic year nears its end.</p>
            </div>
          </div>

          <div className="safeguard-card">
            <div className="icon-circle">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div className="safeguard-text">
              <h4>Confirmation Modal Before Freeze</h4>
              <p>Confirm action before freezing all accounts.</p>
            </div>
          </div>

          <div className="safeguard-card">
            <div className="icon-circle">
              <i className="fa-solid fa-rotate"></i>
            </div>
            
            <div className="safeguard-text">
              <h4>Emergency Undo (24hr Window)</h4>
              <p>24-hour window to quickly undo a freeze action.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AcademicCycleManagement;