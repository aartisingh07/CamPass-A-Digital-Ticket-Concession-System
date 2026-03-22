import React, { useEffect, useState } from "react";
import "../../styles/AdminDashboard/admin.css";

const StudentsList = () => {
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [semesterFilter, setSemesterFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


  const filteredStudents = approvedStudents.filter((student) => {
    // Branch filter
    if (branchFilter && student.studentId.branch !== branchFilter) return false;
    if (semesterFilter && student.studentId.branch !== semesterFilter) return false;

    // Status filter
    if (statusFilter === "Approved" && student.status !== "ACTIVE") return false;
    if (statusFilter === "Rejected" && student.status !== "REJECTED") return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = student.studentId.name.toLowerCase().includes(query);
      const prnMatch = student.studentId.prn.toLowerCase().includes(query);
      if (!nameMatch && !prnMatch) return false;
    }

    return true;
  });
  useEffect(() => {

    fetch("http://localhost:5000/api/admin/approved-students")
      .then(res => res.json())
      .then(data => setApprovedStudents(data))
      .catch(err => console.error(err));

  }, []);

  return (
    <div className="main-content">

      <h2 className="page-title">Approved Students</h2>

      {/* Filters */}
      <div className="approved-filter-bar">
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="">Branch</option>
          <option>CO</option>
          <option>IT</option>
          <option>AR</option>
          <option>EE</option>
          <option>ET</option>
        </select>

        <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
          <option value="">Semester</option>
          <option>1st Semester</option>
          <option>2nd Semester</option>
          <option>3rd Semester</option>
          <option>4th Semester</option>
          <option>5th Semester</option>
          <option>6th Semester</option>
          <option>7th Semester</option>
          <option>8th Semester</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Status</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        {(branchFilter || statusFilter || searchQuery) && (
          <button
            className="clear-filters-btn"
            onClick={() => {
              setBranchFilter("");
              setStatusFilter("");
              setSearchQuery("");
            }}
          >
            ✕ Clear Filters
          </button>
        )}

        <div className="approved-search">
          <input
            placeholder="Search Student Name / ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>
      </div>

      {/* Table */}
      <div className="approved-table">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Branch</th>
              <th>From Station</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {approvedStudents.length === 0 ? (
              <tr>
                <td colSpan="6">No approved students yet</td>
              </tr>
            ) : (

              approvedStudents.map((student) => (
                <tr key={student._id}>

                  <td>{student.studentId.prn}</td>
                  <td>{student.studentId.name}</td>
                  <td>{student.studentId.branch}</td>
                  <td>{student.fromStation}</td>
                  <td>{student.category}</td>

                  <td>
                    <span className="approved-badge">Approved</span>
                  </td>

                </tr>
              ))

            )}

          </tbody>

        </table>
      </div>

    </div>
  );
};

export default StudentsList;