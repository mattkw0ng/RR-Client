import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import AdminPage from "./AdminPage";
import Home from "../admin/Home";
import axios from "axios";
import API_URL from "../../config";
import { Badge } from "reactstrap";
import RoomRes from "./RoomRes";
import "./AdminPortal.css";

const AdminPortal = () => {
  const location = useLocation(); // Get current route
  const [numPendingEvents, setNumPendingEvents] = useState(0);

  // Fetch pending events count
  const fetchNumPendingEvents = async () => {
    try {
      const response = await axios.get(API_URL + "/api/numPendingEvents", { withCredentials: true });
      setNumPendingEvents(response.data);
    } catch (e) {
      console.error("Error fetching numPendingEvents", e.message);
    }
  };

  useEffect(() => {
    fetchNumPendingEvents();
  }, []);

  return (
    <div className="admin-portal vh100-calc">
      {/* Sidebar Navigation */}
      <div className="sidebar bg-light shadow">
        <h3>Admin Portal</h3>
        <ul className="nav flex-column">
          <li className={`nav-item ${location.pathname === "/admin/home" ? "active" : ""}`}>
            <Link to="/admin/home" className="nav-link">Home</Link>
          </li>
          <li className={`nav-item ${location.pathname === "/admin/approvals" ? "active" : ""}`}>
            <Link to="/admin/approvals" className="nav-link">
              Approvals <Badge size="sm" color={numPendingEvents > 0 ? "danger" : "secondary"}>{numPendingEvents}</Badge>
            </Link>
          </li>
          <li className={`nav-item ${location.pathname === "/admin/reserve" ? "active" : ""}`}>
            <Link to="/admin/reserve" className="nav-link">Admin Reserve Form</Link>
          </li>
        </ul>
      </div>

      {/* Page Content */}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate replace to="/admin/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/approvals" element={<AdminPage />} />
          <Route path="/reserve" element={<RoomRes isAdmin={true} />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPortal;
