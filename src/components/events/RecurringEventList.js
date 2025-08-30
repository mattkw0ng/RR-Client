import React from "react";
import { Badge } from "reactstrap";
import { formatEventDates } from "../../util/util";
import "../pages/AdminPortal.css";

const RecurringEventList = ({ list }) => {

  return (
    <div className="recurring-event-list">
      {list.map(instance => {
        const hasNoConflicts = instance.conflicts.length === 0;
        return (
          <span key={instance.id} className={hasNoConflicts ? "" : "text-danger"}>
            {formatEventDates(instance.start.dateTime, instance.end.dateTime)} |
            <a
              href={instance.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-italic text-${hasNoConflicts ? 'secondary' : 'danger'} event-link event-id`}
              style={{ textDecoration: 'none' }}
            >
              <small>&nbsp;{instance.id}</small>
            </a>
            {hasNoConflicts
              ? null
              : <Badge bg="info" pill className="ms-2" color='danger' style={{ fontSize: '0.6em' }}>
                Conflict
              </Badge>
            }
            <br />
          </span>
        );
      })}
    </div>
  )
}

export default RecurringEventList;