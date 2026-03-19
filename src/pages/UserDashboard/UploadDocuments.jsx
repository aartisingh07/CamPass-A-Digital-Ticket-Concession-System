import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/UserDashboard/uploadDocuments.css";

import centralStations from "../../data/centralStations.json";
import westernStations from "../../data/westernStations.json";
import harbourStations from "../../data/harbourStations.json";


function UploadDocuments() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("open");

  const [aadhaar, setAadhaar] = useState(null);
  const [electricity, setElectricity] = useState(null);
  const [caste, setCaste] = useState(null);
  const [fromStation, setFromStation] = useState("");

  const student = JSON.parse(localStorage.getItem("student"));
  const isSCSTStudent =
    student?.caste === "SC" || student?.caste === "ST";

  // VALIDATION CHECK
  const isFormValid =
    aadhaar &&
    electricity &&
    fromStation.trim() !== "" &&
    (category === "open" || caste);

    const allStations = [
      // Central main line
      ...centralStations.stations.map(s => s.name),

      // Central branches
      ...centralStations.branches.karjat_khopoli,
      ...centralStations.branches.kasara,

      // Western line
      ...westernStations.stations.map(s => s.name),

      // Harbour line
      ...harbourStations.main_route,
      ...harbourStations.branches.towards_panvel,
      ...harbourStations.branches.towards_goregaon
    ].map(station => station.toLowerCase());

  const handleSubmit = async (e) => {
  e.preventDefault();

  const stationInput = fromStation.trim().toLowerCase();
  const student = JSON.parse(localStorage.getItem("student"));

  const res = await fetch(`http://localhost:5000/api/students/document-status/${student._id}`);
  const data = await res.json();

  if (data.status === "PENDING") {
    toast.dismiss();
    toast.info("Your documents are already under review.");
    return;
  }

  if (data.status === "ACTIVE") {
    toast.dismiss();
    toast.error("Documents already approved. You cannot upload again.");
    return;
  }

  // REQUIRED FIELD CHECK
  if (!aadhaar || !electricity || stationInput === "") {
    toast.error("Please fill all required fields");
    return;
  }

  // STATION VALIDATION
  if (!allStations.includes(stationInput)) {
    toast.dismiss();
    toast.error(
      "Invalid station name. Please enter a valid Mumbai local station.",
      { autoClose: 4000 }
    );

    setTimeout(() => {
      window.location.reload();
    }, 4000);

    return;
  }

  try {

    const formData = new FormData();

    formData.append("studentId", student._id);
    formData.append("fromStation", fromStation);
    formData.append("aadharNumber", student.aadhar);
    formData.append("category", category === "open" ? "OPEN" : "SCST");

    formData.append("aadhar", aadhaar);
    formData.append("electricity", electricity);

    if (category === "scst") {
      formData.append("casteCertificate", caste);
    }

    const response = await fetch(
      "http://localhost:5000/api/students/upload-documents",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.dismiss();
      toast.success("Documents uploaded successfully. Your documents are now under review.");

      setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

    } else {
      toast.dismiss();
      toast.error(data.message);
    }
  } catch (error) {
    toast.dismiss();
    toast.error("Upload failed");
  }
};

  return (
    <div className="upload-container">
      <h2 className="section-title">Upload Documents</h2>

      {/* CATEGORY TOGGLE */}
      <div className="category-toggle">
        <button
          type="button"
          className={category === "open" ? "active" : ""}
          onClick={() => setCategory("open")}
        >
          Open
        </button>

        <button
          type="button"
          disabled={!isSCSTStudent}
          className={category === "scst" ? "active" : ""}
          onClick={() => setCategory("scst")}
        >
          SC / ST
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* --- Aadhaar Card Field --- */}
        <div className="doc-field">
          <label>Aadhaar Card *</label>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setAadhaar(e.target.files[0])}
          />
        </div>

        {/* --- Electricity Bill Field --- */}
        <div className="doc-field">
          <label>Electricity Bill *</label>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setElectricity(e.target.files[0])}
          />
        </div>

        {/* --- Caste Certificate Field (Conditional) --- */}
        {category === "scst" && (
          <div className="doc-field">
            <label>Caste Certificate *</label>
            <input
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setCaste(e.target.files[0])}
            />
          </div>
        )}

        {/* TRAVEL DETAILS */}
        <div className="travel-row">
          <div className="travel-field">
            <label>From *</label>
            <input
              type="text"
              placeholder="Enter starting station"
              value={fromStation}
              required
              onChange={(e) => setFromStation(e.target.value)}
            />
          </div>

          <div className="travel-field">
            <label>To</label>
            <input type="text" value="Thane" disabled className="disabled-input" />
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!isFormValid}
        >
          Upload Documents
        </button>
      </form>
      {/* IMPORTANT INSTRUCTIONS */}
      <div className="instructions-box">
        <h3>
          <i className="fa-solid fa-circle-info"></i> Important Instructions Before Uploading Documents
        </h3>

        <ul>
          <li>Upload clear scanned copies or photos of the required documents.</li>
          <li>Ensure all text and numbers are clearly visible in the uploaded files.</li>
          <li>Accepted file formats: <strong>PDF only</strong>.</li>
          <li>Maximum file size for each document: <strong>2 MB</strong>.</li>
          <li>The Aadhaar card must match the student's registered name and PRN details.</li>
          <li>The electricity bill must show the current residential address of the student.</li>
          <li>Make sure the From and To stations are entered correctly before submitting.</li>
          <li>Uploading incorrect or unclear documents may lead to rejection of the concession application.</li>
          <li>Once submitted, documents cannot be edited until the admin reviews the application.</li>
        </ul>
      </div>
    </div>
  );
}

export default UploadDocuments;