import React from "react";
import { useEffect, useState } from "react";
import "../../styles/AdminDashboard/admin.css";

const AdminHome = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/applications")
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const pendingStudents = applications.filter((app) => {
  if (app.status === "PENDING") return true;

  if (
    app.status === "ACTIVE" &&
    app.undoAvailableUntil &&
    new Date(app.undoAvailableUntil) > new Date()
  ) {
    return true;
  }

  return false;
});


  const approveApplication = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/application/approve/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (data.success) {
        alert("Application approved");

        fetchApplications();

        setSelectedApplication(null);
      }

    } catch (error) {
      console.error("Approve failed");
    }
  };
const rejectApplication = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/application/reject/${id}`,
      {
        method: "PUT"
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Application rejected");

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: "REJECTED" } : app
        )
      );

      setSelectedApplication(null);
    }

  } catch (error) {
    console.error("Reject failed");
  }
};

const fetchApplications = () => {
  fetch("http://localhost:5000/api/admin/applications")
    .then((res) => res.json())
    .then((data) => {
      setApplications(data);
    })
    .catch((err) => console.error(err));
};

useEffect(() => {
  fetchApplications();
}, []);

const undoApproval = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/admin/undo-approval/${id}`, {
      method: "POST"
    });

    alert("Undo successful");

    fetchApplications();

    setSelectedApplication(null);

  } catch (error) {
    console.error("Undo failed", error);
  }
};

  return (
    <>
      {/* DASHBOARD CARDS */}
      <div className="cards">
        <div className="card">
          <h4>Total Applications Submitted</h4>
          <h2>None</h2>
        </div>

        <div className="card">
          <h4>Approved Applications</h4>
          <h2>None</h2>
        </div>

        <div className="card">
          <h4>Pending Approvals</h4>
          <h2>None</h2>
        </div>

        <div className="card">
          <h4>Total Concessions (This Year)</h4>
          <h2>None</h2>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-left">
          <span className="filter-text">Filter By:</span>

          <div className="filter-group">
            <select>
              <option>Semester</option>
              <option>1st Semester</option>
              <option>2nd Semester</option>
              <option>3rd Semester</option>
              <option>4th Semester</option>
              <option>5th Semester</option>
              <option>6th Semester</option>
              <option>7th Semester</option>
              <option>8th Semester</option>
            </select>

            <select>
              <option>Caste</option>
              <option>Open</option>
              <option>SC/ST</option>
            </select>
          </div>
        </div>

        <div className="search-container">
          <span className="search-label">Search:</span>
          <div className="search-box">
            <input
              type="text"
              placeholder="Student Name / Student ID"
            />
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="table-section">
        <h3>Applications Awaiting Review</h3>

        {pendingStudents.length === 0 ? (
          <p className="no-data">
            All applications have been reviewed 🎉
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Semester</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentId.prn}</td>
                  <td>{student.studentId.name}</td>
                  <td>{student.studentId.branch}</td>
                  <td>
                    <span
                      className={`status ${student.status.toLowerCase()}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedApplication(student)}
                    >
                      View Application
                    </button> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content">

            {/* ACTION BUTTONS TOP */}
            <div className="modal-actions-top">

              <button
                className="approve-btn"
                onClick={() => approveApplication(selectedApplication._id)}
              >
                ✓ Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => rejectApplication(selectedApplication._id)}
              >
                ✕ Reject
              </button>

            </div>

            <h3>Student Documents</h3>

            <div className="document-grid">

              {/* Aadhaar */}
              <div
                className="document-card"
                onClick={() =>
                  window.open(
                    `http://localhost:5000/uploads/documents/${selectedApplication.aadharFile}`,
                    "_blank"
                  )
                }
              >
                <p>Aadhar Card</p>
              </div>

              {/* Electricity Bill */}
              <div
                className="document-card"
                onClick={() =>
                  window.open(
                    `http://localhost:5000/uploads/documents/${selectedApplication.electricityBillFile}`,
                    "_blank"
                  )
                }
              >
                <p>Electricity Bill</p>
              </div>

              {selectedApplication.casteCertificateFile && (
                <div
                  className="document-card"
                  onClick={() =>
                    window.open(
                      `http://localhost:5000/uploads/documents/${selectedApplication.casteCertificateFile}`,
                      "_blank"
                    )
                  }
                >
                  <p>Caste Certificate</p>
                </div>
              )}

            </div>
            
            {/* CLOSE BUTTON BOTTOM LEFT */}
            <div className="modal-footer">
              {selectedApplication.undoAvailableUntil &&
                new Date(selectedApplication.undoAvailableUntil) > new Date() && (
                  <button
                    className="undo-btn"
                    onClick={() => undoApproval(selectedApplication._id)}
                  >
                    Undo
                  </button>
                )}
              <button
                className="close-btn"
                onClick={() => setSelectedApplication(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
export default AdminHome