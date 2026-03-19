import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard/admin.css";

const AdminNotifications = () => {

  const navigate = useNavigate();

  const [notifications,setNotifications] = useState([]);
  const [activeTab,setActiveTab] = useState("all");

  useEffect(()=>{

    const admin = JSON.parse(localStorage.getItem("admin"));

    if(!admin) return;

    fetch(`http://localhost:5000/api/admin/notifications/${admin._id}`)
    .then(res=>res.json())
    .then(data=>setNotifications(data))
    .catch(()=>setNotifications([]));

  },[]);

  const markRead = async (id) => {

    try {

      await fetch(`http://localhost:5000/api/admin/notifications/read/${id}`, {
        method: "PUT"
      });

      setNotifications(prev =>
        prev.map(n =>
          n._id === id ? { ...n, view: "read" } : n
        )
      );

    } catch (error) {
      console.error("Error marking notification as read");
    }

  };


  const filteredNotifications = notifications.filter(n=>{

    if(activeTab==="all") return true;
    if(activeTab==="unread") return n.view==="unread";
    if(activeTab==="read") return n.view==="read";

  });


  return(

    <div className="notifications-page">

      <div className="notifications-header">

        <h2>Notifications</h2>

        <button
        className="back-dashboard-btn"
        onClick={()=>navigate("/admin-dashboard")}
        >
        ← Back to Dashboard
        </button>

      </div>

      <div className="notifications-tabs">

        <span
        className={activeTab==="all"?"active-tab":""}
        onClick={()=>setActiveTab("all")}
        >
        All ({notifications.length})
        </span>

        <span
        className={activeTab==="unread"?"active-tab":""}
        onClick={()=>setActiveTab("unread")}
        >
        Unread ({notifications.filter(n=>n.view==="unread").length})
        </span>

        <span
        className={activeTab==="read"?"active-tab":""}
        onClick={()=>setActiveTab("read")}
        >
        Read ({notifications.filter(n=>n.view==="read").length})
        </span>

      </div>

      <div className="notifications-list">

        {filteredNotifications.length===0 ?(

          <p className="empty-notification">No notifications</p>

        ):(
          [...filteredNotifications]
            .sort((a,b)=> new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time))
            .map(n => (

            <div
            key={n._id}
            className={`notification-card ${n.view==="unread"?"unread":""}`}
            onClick={()=>markRead(n._id)}
            >

            <div className="notification-message">
            {n.message}
            </div>

            <div className="notification-meta">
            {n.date} • {n.time}
            </div>

            </div>

          ))
        )}

      </div>

    </div>

  );

};

export default AdminNotifications;