import React from "react";
import "../../styles/AdminDashboard/admin.css";

const Reports = () => {
  return (
    <div className="main-content">

      <h2 className="reports-title">Annual Concession Reports</h2>

      {/* CURRENT YEAR SECTION */}
      <div className="current-report-card">
        <div className="current-left">
          <h3>Current Academic Year (2024–2025)</h3>
          <p>
            View and download the concession report for the current academic year.
          </p>
        </div>

        <div className="current-actions">
          <button className="primary-btn">View Report</button>

          <button className="secondary-btn">
            Download 
            <i className="fas fa-download download-icon"></i>
          </button>
        </div>
      </div>

      {/* PREVIOUS REPORTS SECTION */}
      <div className="previous-section">

        <div className="previous-card">
          <h3>Previous Academic Year Reports</h3>

          <div className="previous-item">
            <span>2023–2024</span>
            <div>
              <button className="view-mini">
                <i className="fas fa-search"></i> View
              </button>
              <button className="download-mini">
                <i className="fas fa-download"></i> Download
              </button>
            </div>
          </div>

          <div className="previous-item">
            <span>2022–2023</span>
            <div>
              <button className="view-mini">
                <i className="fas fa-search"></i> View
              </button>
              <button className="download-mini">
                <i className="fas fa-download"></i> Download
              </button>
            </div>
          </div>

          <div className="previous-item">
            <span>2021–2022</span>
            <div>
              <button className="view-mini">
                <i className="fas fa-search"></i> View
              </button>
              <button className="download-mini">
                <i className="fas fa-download"></i> Download
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="instruction-card">
        <h3>Instructions for Admin</h3>
        <ul>
          <li>Review report data carefully before downloading.</li>
          <li>Ensure current academic year selection is correct.</li>
          <li>Use “View Report” to verify entries before exporting.</li>
          <li>Maintain downloaded reports securely for audit purposes.</li>
          <li>Do not modify official document data manually.</li>
        </ul>
      </div>

    </div>
  );
};

export default Reports;