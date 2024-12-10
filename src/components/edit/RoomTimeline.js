import React, { useState, useRef, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import "./StackedTimeline.css";
import { LuMoveLeft, LuMoveRight } from "react-icons/lu";

const RoomTimeline = ({ timeRange, setTimeRange }) => {
  const rangeStart = 6; // 6:00 AM
  const rangeEnd = 24; // Midnight
  const timelineRef = useRef(null);

  const totalHours = rangeEnd - rangeStart;

  const [gridSize, setGridSize] = useState(0);
  const [range, setRange] = useState({
    startHour: new Date(timeRange.start.dateTime).getHours() + new Date(timeRange.start.dateTime).getMinutes() / 60,
    endHour: new Date(timeRange.end.dateTime).getHours() + new Date(timeRange.end.dateTime).getMinutes() / 60,
    formattedStart: new Date(timeRange.start.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    formattedEnd: new Date(timeRange.end.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  const recalculateGridAndPosition = useCallback(() => {
    if (timelineRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      setGridSize(timelineWidth / (totalHours * 2));
      const startX = ((range.startHour - rangeStart) / totalHours) * timelineWidth;
      const width = ((range.endHour - range.startHour) / totalHours) * timelineWidth;
      setRange((prev) => ({
        ...prev,
        startX,
        width,
      }));
    }
  }, [range.startHour, range.endHour, rangeStart, totalHours]);

  useEffect(() => {
    recalculateGridAndPosition();
    const handleResize = () => recalculateGridAndPosition();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [recalculateGridAndPosition]);

  const positionToTime = (x) => {
    const timelineWidth = timelineRef.current.offsetWidth;
    const timePerPixel = totalHours / timelineWidth;
    return x * timePerPixel + rangeStart;
  };

  const formatTime = (hour) => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleDrag = (data) => {
    const newStartHour = Math.min(
      Math.max(positionToTime(data.x), rangeStart),
      rangeEnd - (range.endHour - range.startHour)
    );
    const newEndHour = newStartHour + (range.endHour - range.startHour);

    const updatedRange = {
      ...range,
      startHour: Math.round(newStartHour * 10) / 10, // Round to 1 decimal place
      endHour: Math.round(newEndHour * 10) / 10,
      formattedStart: formatTime(newStartHour),
      formattedEnd: formatTime(newEndHour),
    };

    setRange(updatedRange);
    setTimeRange({...timeRange,
      start: { ...timeRange.start, dateTime: new Date(0, 0, 0, Math.floor(newStartHour), (newStartHour % 1) * 60).toISOString() },
      end: { ...timeRange.end, dateTime: new Date(0, 0, 0, Math.floor(newEndHour), (newEndHour % 1) * 60).toISOString() },
    });
  };

  return (
    <div className="stacked-timeline" ref={timelineRef}>
      <div className="timeline-scale">
        {Array.from({ length: totalHours + 1 }, (_, i) => {
          const hour = rangeStart + i;
          return (
            hour % 2 === 0 && (
              <span key={hour} style={{ left: `${(i / totalHours) * 100}%` }}>
                {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </span>
            )
          );
        })}
      </div>

      <div className="timeline-bars">
        <div className="timeline-bar-container">
          <Draggable
            axis="x"
            bounds="parent"
            grid={[gridSize, gridSize]}
            position={{ x: range.startX, y: 0 }}
            onDrag={(e, data) => handleDrag(data)}
          >
            <div className="timeline-bar gradient-red" style={{ width: `${range.width}px`}}>
              <LuMoveLeft className="drag-icon left" />
              <LuMoveRight className="drag-icon right" />
            </div>
          </Draggable>
        </div>
      </div>

      <div className="bar-time-info">
        <span className="time-label p-1 gradient-red">
          Time Range
        </span>
        &nbsp;
        {range.formattedStart} - {range.formattedEnd}
      </div>
    </div>
  );
};

export default RoomTimeline;
