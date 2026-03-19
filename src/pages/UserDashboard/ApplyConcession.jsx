import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/UserDashboard/applyConcession.css";
import passSample from "../../assets/pass-sample.jpeg";

function ApplyConcession() {
  const [travelClass, setTravelClass] = useState("1st");
  const [period, setPeriod] = useState("monthly");
  const [appDate, setAppDate] = useState(new Date().toISOString().split('T')[0]);
  const [prevTicketNo, setPrevTicketNo] = useState("");
  const [seasonTicketNo, setSeasonTicketNo] = useState("");
  const [ticketExpiry, setTicketExpiry] = useState("");
  const [showVchModal, setShowVchModal] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);

  const isFormValid =
    travelClass &&
    period &&
    appDate &&
    prevTicketNo.trim() !== "" &&
    seasonTicketNo.trim() !== "" &&
    ticketExpiry !== "";

  const handleApply = async () => {
  const student = JSON.parse(localStorage.getItem("student"));

  try {
    // Check document status
    const statusRes = await fetch(
      `http://localhost:5000/api/students/document-status/${student._id}`
    );
    const statusData = await statusRes.json();

    if (statusData.status !== "ACTIVE") {
      toast.dismiss();
      toast.error("Complete document upload and wait for admin approval");
      return;
    }

    // Apply concession — save all details to DB
    const res = await fetch("http://localhost:5000/api/students/apply-concession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId:     student._id,
        period,
        travelClass,
        prevTicketNo,
        seasonTicketNo,
        ticketExpiry,
        appDate:       new Date().toISOString().split("T")[0]
      })
    });

    const data = await res.json();

    if (data.success) {
      toast.dismiss();
      toast.success("✅ Concession applied! Go to My Concession to download your form.");
    } else {
      toast.dismiss();
      toast.error(data.message);
    }

  } catch (error) {
    toast.dismiss();
    toast.error("Something went wrong");
  }
};

  return (
    <div className="concession-layout">

      {/* LEFT SIDE FORM */}
      <div className="concession-container">
        <h2 className="section-title">Concession Application</h2>

        {/* SELECT CLASS */}
        <div className="form-group">
          <label>Select Class</label>
          <div className="class-toggle">
            <button
              type="button"
              className={travelClass === "1st" ? "active" : ""}
              onClick={() => setTravelClass("1st")}
            >1st Class</button>
            <button
              type="button"
              className={travelClass === "2nd" ? "active" : ""}
              onClick={() => setTravelClass("2nd")}
            >2nd Class</button>
          </div>
        </div>

        {/* SELECT PERIOD */}
        <div className="form-group">
          <label>Select Period</label>
          <div className="period-options">
            <label className="radio-label">
              <input type="radio" name="period" checked={period === "monthly"} onChange={() => setPeriod("monthly")} />
              <span>Monthly</span>
            </label>
            <label className="radio-label">
              <input type="radio" name="period" checked={period === "quarterly"} onChange={() => setPeriod("quarterly")} />
              <span>Quarterly</span>
            </label>
          </div>
        </div>

        {/* VCH NO */}
        <div className="form-group">
          <label>
            Voucher Number (Vch No)
            <span className="where-to-find-link" onClick={() => setShowVchModal(true)}>
              📍 Where to find this?
            </span>
          </label>
          <p className="field-hint">Enter the Vch No printed on your railway concession pass</p>
          <div className="ticket-input-wrapper">
            <span className="ticket-prefix">🎫</span>
            <input
              type="text"
              className="ticket-input"
              placeholder="e.g. B03900007"
              value={prevTicketNo}
              onChange={(e) => setPrevTicketNo(e.target.value.toUpperCase())}
              maxLength={20}
            />
          </div>
        </div>

        {/* SEASON TICKET NUMBER */}
        <div className="form-group">
          <label>
            Season Ticket Number
            <span className="where-to-find-link" onClick={() => setShowSeasonModal(true)}>
              📍 Where to find this?
            </span>
          </label>
          <p className="field-hint">Enter the last 4 digits of season ticket number</p>
          <div className="ticket-input-wrapper">
            <span className="ticket-prefix">🎟️</span>
            <input
              type="text"
              className="ticket-input"
              placeholder="e.g. 22815120 then enter 5120"
              value={seasonTicketNo}
              onChange={(e) => setSeasonTicketNo(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
            />
          </div>
        </div>

        {/* TICKET EXPIRY DATE */}
        <div className="form-group">
          <label>Previous Ticket Expiry Date</label>
          <p className="field-hint">The "Valid To" date printed on your last railway pass</p>
          <div className="date-input-wrapper">
            <input
              type="date"
              className="calendar-input"
              value={ticketExpiry}
              onChange={(e) => setTicketExpiry(e.target.value)}
            />
          </div>
        </div>

        {/* DATE OF APPLICATION */}
        <div className="form-group">
          <label>Date of Application</label>
          <div className="date-input-wrapper">
            <input
              type="date"
              className="calendar-input"
              value={appDate}
              onChange={(e) => setAppDate(e.target.value)}
            />
          </div>
        </div>

        {/* NOTE */}
        <div className="note-box">
          ⚠ Note: A concession application can be submitted only once for a selected time period. Reapplication is not allowed until the current concession period has expired.
        </div>

        <button className="apply-btn" disabled={!isFormValid} onClick={handleApply}>
          Apply & Download Concession Form
        </button>
      </div>

      {/* RIGHT SIDE INSTRUCTIONS */}
      <div className="instructions-box">
        <h3>Important Instructions</h3>
        <ul>
          <li>Select the correct travel class (1st Class or 2nd Class).</li>
          <li>Choose a valid concession period.</li>
          <li><b>Monthly Pass</b> – valid for 1 month.</li>
          <li><b>Quarterly Pass</b> – valid for 3 months.</li>
          <li>SC/ST students must upload valid caste certificate.</li>
          <li>Upload all documents before applying.</li>
          <li>After approval check the <b>My Concession</b> section.</li>
          <li>Application cannot be modified once submitted.</li>
          <li>After downloading, get the form <b>signed & stamped</b> from college office.</li>
          <li>Submit the signed form at the <b>railway counter</b> to get your pass.</li>
        </ul>
      </div>

      {/* VCH NO MODAL */}
      {showVchModal && (
        <div className="modal-overlay" onClick={() => setShowVchModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Where is the Vch No?</h3>
              <button className="modal-close" onClick={() => setShowVchModal(false)}>✕</button>
            </div>
            <p className="modal-desc">
              Look at the <strong>middle-left area</strong> of your railway pass for <strong>"Vch No:"</strong> as highlighted below.
            </p>
            <div className="pass-image-wrapper">
              <img src={passSample} alt="Railway Pass Sample" className="pass-image" />
              <div className="highlight-box vch-highlight">
                <span className="highlight-label">Vch No is here!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEASON TICKET MODAL */}
      {showSeasonModal && (
        <div className="modal-overlay" onClick={() => setShowSeasonModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Where is the Season Ticket Number?</h3>
              <button className="modal-close" onClick={() => setShowSeasonModal(false)}>✕</button>
            </div>
            <p className="modal-desc">
              Look at the <strong>top-right corner</strong> of your railway pass for the large printed number as highlighted below.
            </p>
            <div className="pass-image-wrapper">
              <img src={passSample} alt="Railway Pass Sample" className="pass-image" />
              <div className="highlight-box season-highlight">
                <span className="highlight-label">Season Ticket No!</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ApplyConcession;