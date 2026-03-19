import { useNavigate } from "react-router-dom";
import heroImage from "../assets/home.jpeg";
import "../styles/home.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="overlay">
        <h1>Apply for Student Travel Concession</h1>

        <div className="hero-buttons">
          <button
            className="student-btn"
            onClick={() => navigate("/student-login")}
          >
            <i className="fa-solid fa-user-graduate"></i>
            Student Login
          </button>

          <button
            className="admin-btn"
            onClick={() => navigate("/admin-login")}
          >
            <i className="fa-solid fa-building-columns"></i>
            Admin Login
          </button>
        </div>

        <div className="steps-bar">
          <div className="step-item">
            <span className="step-number">1</span>
            <span>Register Online</span>
          </div>

          <div className="step-arrow">
            <i className="fa-solid fa-chevron-right"></i>
          </div>

          <div className="step-item">
            <i className="fa-regular fa-file-lines"></i>
            <span>Upload Documents</span>
          </div>

          <div className="step-arrow">
            <i className="fa-solid fa-chevron-right"></i>
          </div>

          <div className="step-item">
            <i className="fa-solid fa-train"></i>
            <span>Get Your Concession Pass</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;