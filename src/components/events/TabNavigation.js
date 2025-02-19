import React, { useState } from "react";
import "./TabNavigation.css"

const TabNavigation = ({ eventsData }) => {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="tab-container">
        {["pending", "approved", "history", "proposed"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'proposed' ? "Action Needed" : tab.charAt(0).toUpperCase() + tab.slice(1)} {/* Capitalizes tab names */}
          </button>
        ))}
      </div>

      {/* Event List Display */}
      <div className="tab-content">
        {eventsData ? eventsData[activeTab] : "Nothing yet!"}
      </div>
    </div>
  );
};

export default TabNavigation;
