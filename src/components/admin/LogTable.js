import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../config";

export default function AdminActivityLog() {
  const [logs, setLogs] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios.get(API_URL + '/api/admin/activity-logs')
      .then(response => {
        setLogs(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load activity logs", err);
        setLoading(false);
      });
  }, []);

  const toggleExpanded = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  if (loading) return <p>Loading activity logs…</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Admin Activity Logs</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Route</th>
            <th>Event</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {logs.map(log => {
            let parsedDetails = null;
            try {
              parsedDetails = log.details && JSON.parse(log.details);
            } catch {
              parsedDetails = log.details;
            }

            return (
              <React.Fragment key={log.id}>
                <tr
                  key={log.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    background:
                      log.action.toLowerCase().includes("reject")
                        ? "#fff3cd"
                        : log.action.toLowerCase().includes("error")
                        ? "#f8d7da"
                        : "transparent"
                  }}
                >
                  <td>{log.id}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    <strong>{log.user_name}</strong>
                    <br />
                    <small>{log.user_email}</small>
                  </td>
                  <td>{log.action}</td>
                  <td>
                    <code>{log.method}</code>
                    <br />
                    <small>{log.route}</small>
                  </td>
                  <td>
                    {log.event_id ? (
                      <code>{log.event_id}</code>
                    ) : (
                      <em>—</em>
                    )}
                  </td>
                  <td>
                    <button onClick={() => toggleExpanded(log.id)} type="button">
                      {expanded === log.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expanded === log.id && (
                  <tr>
                    <td colSpan={7}>
                      <pre
                        style={{
                          background: "#f6f8fa",
                          padding: "1rem",
                          borderRadius: "6px",
                          maxHeight: "400px",
                          overflow: "auto"
                        }}
                      >
                        {typeof parsedDetails === "string"
                          ? parsedDetails
                          : JSON.stringify(parsedDetails, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}