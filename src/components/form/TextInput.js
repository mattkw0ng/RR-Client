import React from "react";

function TextInput({ label, name, handleFormChange, formData, type='text'}) {

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        name={name}
        type={type}
        className="form-control"
        value={formData[name]}
        onChange={(e) => handleFormChange(e)}
      ></input>
    </div>
  )
}

export default TextInput