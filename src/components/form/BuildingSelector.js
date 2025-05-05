import React from "react";

const BuildingSelector = ({ selectedBuilding, handleSetBuilding, customBuilding, handleCustomBuildingChange, rooms }) => {
  const existingBuildings = Object.keys(rooms?.roomsGrouped || {});

  return (
    <div className="form-group">
      <label htmlFor="buildingSelect">Building Location</label>
      <select
        className="form-select"
        id="buildingSelect"
        name="buildingSelect"
        value={selectedBuilding}
        onChange={handleSetBuilding}
      >
        <option value={""}>Select a building...</option>
        {existingBuildings.map((building, idx) => (
          <option key={"building" + idx} value={building}>
            {building}
          </option>
        ))}
        <option value="Other">Other</option>
      </select>

      {selectedBuilding === "Other" && (
        <div>
          <label htmlFor="customBuilding" className="form-label">
            New Building Name
          </label>
          <input
            type="text"
            id="customBuilding"
            name="customBuilding"
            className="form-control"
            value={customBuilding}
            onChange={handleCustomBuildingChange}
            placeholder="Enter new building name"
          />
        </div>
      )}
    </div>
  );
};

export default BuildingSelector;