import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login/auth.css";
import "../../styles/Components Files/footer.css";
import { toast } from "react-toastify";

function AdminLogin() {

  const navigate = useNavigate();

  // Theme state
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Admin login states
  const [adminPnr, setAdminPnr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // LOGIN FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ PRN VALIDATION
    if (adminPnr.length !== 9) {
      toast.error("Admin PRN must be exactly 9 digits", {
        autoClose: 3000
      });
      return;
    }

    try {

      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          admin_pnr: adminPnr,
          email: email,
          password: password
        })
      });

      const data = await res.json();

     if (data.success) {

        toast.success("Admin Login Successful ✅", {
          autoClose: 3000
        });

        // store login info
        localStorage.setItem("admin", JSON.stringify(data.admin));

        navigate("/admin-dashboard");

      }else {
        toast.error(data.message, {
        autoClose: 3000
      });
      }

    } catch (error) {
      console.error(error);
      toast.error("Server Error ❌", {
        autoClose: 3000
      });
    }
  };

  return (
    <div className="auth-page">

      {/* HEADER */}
      <header className="auth-header">
        <h2>CamPass - Admin Login</h2>

        <button
          className="back-home-btn"
          onClick={() => navigate("/", { replace: true })}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Home
        </button>
      </header>

      {/* LOGIN FORM */}
      <div className="auth-container">
        <form onSubmit={handleSubmit}>

          <h1>Admin Login</h1>

          {/* ADMIN PRN */}
          <input
            type="text"
            placeholder="Admin PRN"
            value={adminPnr}
            maxLength="9"
            inputMode="numeric"
            pattern="[0-9]{9}"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setAdminPnr(value);
            }}
            required
          />
          {/* EMAIL */}
          <input
            type="email"
            placeholder="College Email"
            value={email}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

        </form>
      </div>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <div className="footer-content">

          <h3 className="footer-title">Need Help ?</h3>

          <div className="contact-grid">

            <div className="contact-card">
              <i className="fa-solid fa-location-dot"></i>
              <h4>Address</h4>
              <p>
                VPMCOE, Thane,<br />
                Mumbai, Maharashtra, India
              </p>

              <div className="map-box small-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.1190147749567!2d72.9782751758081!3d19.19000344838254!2m3!1f0!3f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b925fdf83cf5%3A0x7c39760b6d905bf1!2sVPM's%20Polytechnic%2C%20Thane!5e0!3m2!1sen!2sin!4v1772351604352!5m2!1sen!2sin"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="contact-card">
              <i className="fa-solid fa-phone"></i>
              <h4>Office - Admin</h4>
              <p>(022)-25339872</p>
            </div>

            <div className="contact-card">
              <i className="fa-solid fa-envelope"></i>
              <h4>Email</h4>
              <p>vpmcoe@vpmthane.org</p>
            </div>

            <div className="contact-card">
              <i className="fa-solid fa-clock"></i>
              <h4>Office Hours</h4>
              <p>
                Mon – Fri<br />
                9:00 AM – 5:00 PM
              </p>
            </div>

          </div>
        </div>

        <div
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top ↑
        </div>

        <div className="footer-bottom">
          © 2026 CamPass • Version 1.0
        </div>

      </footer>

    </div>
  );
}

export default AdminLogin;