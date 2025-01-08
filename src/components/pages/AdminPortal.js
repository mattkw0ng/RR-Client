import React, { useState, useEffect } from "react";
import AdminPage from "./AdminPage";
import "./AdminPortal.css";
import Home from "../admin/Home";
import axios from "axios";
import API_URL from "../../config";
import { Badge } from "reactstrap";
import RoomRes from "./RoomRes";

// const Approvals = () => <div className="content"><h2>Approvals</h2><p>Manage pending approvals here.</p></div>;
// const SearchEvents = () => <div className="content"><h2>Search Events</h2><p>Search for events using filters.</p></div>;
// const ReserveRoom = () => <div className="content"><h2>Reserve Room</h2><p>Reserve a room for an event here.</p></div>;

const AdminPortal = () => {
  const [selectedPage, setSelectedPage] = useState("Home");
  const [numPendingEvents, setNumPendingEvents] = useState(0);

  const fetchNumPendingEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/numPendingEvents', { withCredentials: true });
      console.log("Number of pending events: ", response.data);
      setNumPendingEvents(response.data);

    } catch (e) {
      console.error("Error fetching numPendingEvents", e.message);
    }
  }

  useEffect(() => {
    fetchNumPendingEvents();
  }, [])

  const renderPage = () => {
    switch (selectedPage) {
      case "Home":
        return <Home />;
      case "Approvals":
        return <AdminPage />;
      // case "SearchEvents":
      //   return <SearchEvents />;
      case "ReserveRoom":
        return <RoomRes isAdmin={true} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="admin-portal vh100-calc">
      <div className="sidebar bg-light shadow">
        <h3>Admin Portal</h3>
        <ul className="nav flex-column">
          <li onClick={() => setSelectedPage("Home")} className={`nav-item ${selectedPage === "Home" ? 'selected' : ''}`}>
            Home
          </li>
          <li onClick={() => setSelectedPage("Approvals")} className={`nav-item ${selectedPage === "Approvals" ? 'selected' : ''}`}>
            Approvals <Badge size="sm" color="danger" >{numPendingEvents}</Badge>
          </li>
          {/* <li onClick={() => setSelectedPage("SearchEvents")} className={`nav-item ${selectedPage === "SearchEvents" ? 'selected' : ''}`}>
            Search Events
          </li> */}
          <li onClick={() => setSelectedPage("ReserveRoom")} className={`nav-item ${selectedPage === "ReserveRoom" ? 'selected' : ''}`}>
            Reserve Room
          </li> 
        </ul>
      </div>
      <div className="page-content">{renderPage()}</div>
    </div>
  );
};

export default AdminPortal;
