import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../styles/UserDashboard/myConcession.css";

function MyConcession() {
  const [concession, setConcession] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [downloading, setDownloading] = useState(false);

  const student = JSON.parse(localStorage.getItem("student"));

  useEffect(() => {
    const fetchConcession = async () => {
      try {
        const res  = await fetch(
          `http://localhost:5000/api/students/my-concession/${student._id}`
        );
        const data = await res.json();

        if (data.success && data.data) {
          setConcession(data.data);
          if (data.data.concessionStatus === "COMPLETED") {
            toast.dismiss();
            toast.success("🎉 Concession ready! Download your form below.");
          }
        }
      } catch (error) {
        toast.error("Failed to load concession data");
      } finally {
        setLoading(false);
      }
    };

    fetchConcession();
  }, []);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/students/download-concession-pdf/${student._id}`
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Download failed");
        return;
      }

      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `ConcessionForm_${student.name.replace(/ /g, "_")}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Form downloaded! Get it signed from college office.");

    } catch (error) {
      toast.error("Download failed. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const isCompleted = concession?.concessionStatus === "COMPLETED";

  return (
    <div className="concession-history-container">

      <h2 className="section-title">My Concession</h2>

      {loading ? (
        <p style={{ color: "#64748b", padding: "20px 0" }}>Loading...</p>

      ) : !concession ? (
        <p style={{ color: "#64748b", padding: "20px 0" }}>
          No concession record found. Apply for concession first.
        </p>

      ) : (
        <table className="concession-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Period</th>
              <th>Class</th>  
              <th>Route</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{formatDisplayDate(concession.appDate)}</td>
              <td>{concession.period
                ? concession.period.charAt(0).toUpperCase() + concession.period.slice(1)
                : "—"}
              </td>
              <td>{concession.travelClass
                ? (concession.travelClass === "1st" ? "1st Class" : "2nd Class")
                : "—"}
              </td>
              <td>{concession.fromStation} → Thane</td>

              <td>
                <span className={`status-badge ${
                  isCompleted ? "approved" : "pending"
                }`}>
                  {isCompleted ? "Applied" : "Not Applied"}
                </span>
              </td>

              <td>
                <button
                  className={`download-btn ${!isCompleted ? "disabled" : ""}`}
                  onClick={isCompleted ? handleDownload : undefined}
                  disabled={!isCompleted || downloading}
                  title={!isCompleted ? "Apply for concession first" : "Download concession form"}
                >
                  {downloading
                    ? "⏳ Downloading..."
                    : "⬇️ Download"
                  }
                </button>
              </td>

            </tr>
          </tbody>

        </table>
      )}

    </div>
  );
}

export default MyConcession;