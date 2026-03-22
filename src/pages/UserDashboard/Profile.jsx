import { useEffect, useState } from "react";
import "../../styles/UserDashboard/profile.css";

const Profile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("student"));
    setStudent(data);
  }, []);

  if (!student) return <p>Loading profile...</p>;

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="profile-page">

      <h2 className="profile-title">Student Profile</h2>

      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
        <div className="profile-title-bar">
          <h3>{student.name}</h3>
        </div>
        <div className="profile-avatar">
          {initials}
        </div>
      </div>

        {/* PERSONAL INFO */}
        <div className="profile-section">
          <h4>Personal Information</h4>

          <div className="profile-grid">

            <div className="profile-item">
              <i className="fa-solid fa-user"></i>
              <div>
                <label>Name</label>
                <p>{student.name}</p>
              </div>
            </div>

            <div className="profile-item">
              <i className="fa-solid fa-id-card"></i>
              <div>
                <label>PRN Number</label>
                <p>{student.prn}</p>
              </div>
            </div>

            <div className="profile-item">
              <i className="fa-solid fa-calendar"></i>
              <div>
                <label>Year</label>
                <p>{student.year ? `${student.year}${student.year === 1 ? "st" : student.year === 2 ? "nd" : student.year === 3 ? "rd" : "th"} Year` : "—"}</p>
              </div>
            </div>

            <div className="profile-item">
              <i className="fa-solid fa-graduation-cap"></i>
              <div>
                <label>Branch</label>
                <p>{student.branch}</p>
              </div>
            </div>

          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="profile-section">
          <h4>Contact Information</h4>

          <div className="profile-item">
            <i className="fa-solid fa-phone"></i>
            <div>
              <label>Mobile</label>
              <p>{student.mobile}</p>
            </div>
          </div>

        </div>

        {/* DOCUMENTS */}
        <div className="profile-section">
          <h4>Important Documents</h4>

          <div className="profile-item">
            <i className="fa-solid fa-id-badge"></i>
            <div>
              <label>Aadhar</label>
              <p>{student.aadhar}</p>
            </div>
          </div>

        </div>

        {/* OTHER */}
        <div className="profile-section">
          <h4>Other Details</h4>

          <div className="profile-item">
            <i className="fa-solid fa-users"></i>
            <div>
              <label>Caste</label>
              <p>{student.caste}</p>
            </div>
          </div>

          <div className="profile-item">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <label>Address</label>
              <p>
                City: {student.address?.city} <br />
                Pincode: {student.address?.pincode}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;