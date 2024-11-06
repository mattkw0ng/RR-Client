import React from "react";

function SelectInput({ label, name, handleFormChange, formData, options}) {

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select
        name={name}
        className="form-select"
        value={formData[name]}
        onChange={(e) => handleFormChange(e)}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default SelectInput