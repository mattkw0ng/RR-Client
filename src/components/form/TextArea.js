import React from "react";

function TextArea({ label, name, help, handleFormChange, formData }) {

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <small className="text-secondary text-italic">{help}</small>
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