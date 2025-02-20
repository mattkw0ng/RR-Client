import React from "react";
import "./LoadingOverlay.css"

export default function LoadingOverlay({ loading = false }) {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Processing your request...</p>
    </div>
  )
}