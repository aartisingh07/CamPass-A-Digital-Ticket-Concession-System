import "../styles/UserDashboard/dashboard.css";

function DashboardCard({ title, image }) {
  return (
    <div className="dashboard-card">
      <div className="card-image">
        <img src={image} alt={title} />
      </div>

      <div className="card-title">
        {title}
      </div>
    </div>
  );
}

export default DashboardCard;