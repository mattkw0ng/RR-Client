import React from "react";

function TextArea({ label, name, handleFormChange, formData }) {

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <textarea
        name={name}
        className="form-control"
        value={formData[name]}
        onChange={(e) => handleFormChange(e)}
      ></textarea>
    </div>
  )
}

export default TextArea