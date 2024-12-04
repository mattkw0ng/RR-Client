import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import './StackedTimeline.css';
import { Button } from 'reactstrap';
import { LuMoveLeft, LuMoveRight } from "react-icons/lu";
import { GrPowerReset } from "react-icons/gr";


const StackedTimelineDraggable = ({ timeRanges, eventNames=[] }) => {
  const rangeStart = 6; // 1:00 AM
  const rangeEnd = 24; // Midnight
  const timelineRef = useRef(null);

  const totalHours = rangeEnd - rangeStart;

  const [gridSize, setGridSize] = useState(0);
  const [initialRanges, setInitialRanges] = useState([]);
  const [ranges, setRanges] = useState(
    timeRanges.map(({ start, end }, index) => {
      const startHour = new Date(start.dateTime).getHours() + new Date(start.dateTime).getMinutes() / 60;
      const endHour = new Date(end.dateTime).getHours() + new Date(end.dateTime).getMinutes() / 60;
      return {
        id: index,
        startHour,
        endHour,
        formattedStart: new Date(start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formattedEnd: new Date(end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    })
  );

  const [isOverlapping, setIsOverlapping] = useState(true);
  const [isChanged, setIsChanged] = useState([false,false]);

  useEffect(() => {
    if (!initialRanges.length) {
      console.log("Set Initial Ranges")
      // Store initial positions for reset
      setInitialRanges(ranges);
    }
  }, [ranges, initialRanges]);

  const recalculateGridAndPositions = useCallback(() => {
    if (timelineRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      setGridSize(timelineWidth / (totalHours * 2));
      setRanges((prevRanges) =>
        prevRanges.map((range) => {
          const timelineWidth = timelineRef.current.offsetWidth;
          const startX = ((range.startHour - rangeStart) / totalHours) * timelineWidth;
          const width = ((range.endHour - range.startHour) / totalHours) * timelineWidth;
          return {
            ...range,
            startX,
            width,
          };
        })
      );
    }
  }, [totalHours, rangeStart]);
  

  useEffect(() => {
    console.log("recalculating grid and positions");
    recalculateGridAndPositions();
    const handleResize = () => recalculateGridAndPositions();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [recalculateGridAndPositions]);
  

  const positionToTime = (x) => {
    const timelineWidth = timelineRef.current.offsetWidth;
    const timePerPixel = totalHours / timelineWidth;
    return x * timePerPixel + rangeStart;
  };

  const formatTime = (hour) => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const checkOverlap = (ranges) => {
    if (ranges.length < 2) return false;
    const [first, second] = ranges;
    return (
      (first.startHour < second.endHour && first.endHour > second.startHour) || // First overlaps second
      (second.startHour < first.endHour && second.endHour > first.startHour)   // Second overlaps first
    );
  };

  const checkChange = (index, updatedRanges) => {
    const range = updatedRanges[index];
    return !(range?.startHour === initialRanges[index]?.startHour && range?.endHour === initialRanges[index]?.endHour) // Returns true if there was change
  } 

  const handleDrag = (id, data) => {
    setRanges((prevRanges) => {
      const updatedRanges = prevRanges.map((range) => {
        if (range.id === id) {
          const newStartHour = Math.min(
            Math.max(positionToTime(data.x), rangeStart),
            rangeEnd - (range.endHour - range.startHour)
          );
          const newEndHour = newStartHour + (range.endHour - range.startHour);
          return {
            ...range,
            startHour: Math.round(newStartHour*10)/10, // round to 1 decimal place
            endHour: Math.round(newEndHour*10)/10,
            formattedStart: formatTime(newStartHour),
            formattedEnd: formatTime(newEndHour),
          };
        }
        return range;
      });

      setIsOverlapping(checkOverlap(updatedRanges));
      setIsChanged([checkChange(0, updatedRanges), checkChange(1, updatedRanges)]);
      return updatedRanges;
    });
  };

  const resetPositions = () => {
    setRanges(initialRanges);
    setIsOverlapping(checkOverlap(initialRanges));
    setIsChanged([false, false]);
  };

  const DisplayTime = ({ r }) => {
    const range = ranges[r];
    const gradient =
            r === 0
              ? 'linear-gradient(to right, #1e3c72, #2a5298)'
              : isOverlapping
                ? 'linear-gradient(to right, #ff7e5f, #feb47b)' // Overlapping: red gradient
                : 'linear-gradient(to right, #38ef7d, #11998e)'; // No overlap: green gradient
    return (
      <div className="bar-time-info">
        <span className='time-label p-1' style={{background:gradient}}>{eventNames[r]}</span> {/* Event Name */}
        {initialRanges[r]?.formattedStart} - {initialRanges[r]?.formattedEnd}
        <span className={isChanged[r] ? isOverlapping ? "suggested-time red" : "suggested-time green": "hidden"}>
          &nbsp; &gt; &nbsp;{range?.formattedStart} - {range?.formattedEnd}
        </span>

      </div>)
  }

  return (
    <div className="stacked-timeline" ref={timelineRef}>
      <div className="timeline-scale">
        {Array.from({ length: totalHours + 1 }, (_, i) => {
          const hour = rangeStart + i;
          return ( hour % 2 === 0 &&
            <span key={hour} style={{ left: `${(i / totalHours) * 100}%` }}>
              {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </span>
          );
        })}
      </div>

      <div className="timeline-bars">
        {ranges.map((range, index) => {
          const timelineWidth = timelineRef.current ? timelineRef.current.offsetWidth : 0;
          const startX = ((range.startHour - rangeStart) / totalHours) * timelineWidth;
          const width = ((range.endHour - range.startHour) / totalHours) * timelineWidth;

          // Dynamic gradient based on overlap
          const gradient =
            index === 0
              ? 'linear-gradient(to right, #1e3c72, #2a5298)'
              : isOverlapping
                ? 'linear-gradient(to right, #ff7e5f, #feb47b)' // Overlapping: red gradient
                : 'linear-gradient(to right, #38ef7d, #11998e)'; // No overlap: green gradient

          return (
            <div key={range.id} className="timeline-bar-container">
              <Draggable
                axis="x"
                bounds="parent"
                grid={[gridSize, gridSize]}
                position={{ x: startX, y: 30 * index }}
                onDrag={(e, data) => handleDrag(range.id, data)}
              >
                <div className="timeline-bar" style={{ width: `${width}px`, background: gradient }}>
                  <LuMoveLeft className="drag-icon left" />
                  <LuMoveRight className="drag-icon right" />
                </div>
              </Draggable>

            </div>
          );
        })}
      </div>

      <div className='d-flex justify-content-between'>
        <div className='m-0'>
          <DisplayTime r={0} />
          <DisplayTime r={1} />
        </div>
        <Button size='sm' color='secondary' outline onClick={resetPositions} style={{ height: '32px' }}>
          <GrPowerReset /> Reset 
        </Button>
      </div>
    </div>
  );
};

export default StackedTimelineDraggable;
