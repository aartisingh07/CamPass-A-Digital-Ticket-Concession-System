import React, { useEffect, useState } from "react";
import "../../styles/AdminDashboard/admin.css";

const StudentsList = () => {
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


  const filteredStudents = approvedStudents.filter((student) => {
    // Branch filter
    if (branchFilter && student.studentId.branch !== branchFilter) return false;
    if (yearFilter && String(student.studentId.year) !== yearFilter) return false;

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

        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="">Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Status</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        {(branchFilter || yearFilter || statusFilter || searchQuery) && (
          <button
            className="clear-filters-btn"
            onClick={() => {
              setBranchFilter("");
              setYearFilter("");
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

            {filteredStudents.length === 0 ? (
              <td colSpan="6">
                {approvedStudents.length === 0
                  ? "No approved students yet"
                  : "No results found for applied filters 🔍"}
              </td>
            ) : (

              filteredStudents.map((student) => ( 
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