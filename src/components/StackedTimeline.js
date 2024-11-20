import React from 'react';
import './StackedTimeline.css'; // Add this file for styles

const StackedTimeline = ({ timeRanges }) => {
    // Define timeline range: 1:00 AM to midnight (1-24 hours)
    const rangeStart = 6; // 1:00 AM
    const rangeEnd = 22; // Midnight

    // Helper function to calculate percentage width/position
    const calculatePosition = (startHour, endHour, rangeStart, rangeEnd) => {
        const totalDuration = rangeEnd - rangeStart; // Total timeline duration in hours
        const startOffset = ((startHour - rangeStart) / totalDuration) * 100; // Start offset as a percentage
        const width = ((endHour - startHour) / totalDuration) * 100; // Bar width as a percentage
        return { left: `${startOffset}%`, width: `${width}%` };
    };

    // Parse time ranges
    const parsedRanges = timeRanges.map(({ start, end }) => {
        const startHour = new Date(start.dateTime).getHours() + new Date(start.dateTime).getMinutes() / 60;
        const endHour = new Date(end.dateTime).getHours() + new Date(end.dateTime).getMinutes() / 60;

        return {
            startHour,
            endHour,
            formattedStart: new Date(start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            formattedEnd: new Date(end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
    });

    return (
        <div className="stacked-timeline">
            {/* Hour markers */}
            <div className="timeline-scale">
                {Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => {
                    const hour = rangeStart + i;
                    return (
                        hour % 2 === 0 ?
                        <span key={hour} style={{ left: `${((hour - rangeStart) / (rangeEnd - rangeStart)) * 100}%` }}>
                            {hour === 12 ? '12 PM' : hour > 11 ? `${hour - 12} PM` : `${hour} AM`}
                        </span>
                        : null
                    );
                })}
            </div>

            {/* Time bars */}
            <div className="timeline-bars">
                {parsedRanges.map((range, index) => {
                    const style = calculatePosition(range.startHour, range.endHour, rangeStart, rangeEnd);
                    const gradient = index === 0 
                        ? 'linear-gradient(to right, #007BFF, #54DEFD)' 
                        : 'linear-gradient(to right, #EE5665, #FF906B)';

                    return (
                        <div
                            key={index}
                            className="timeline-bar"
                            style={{ ...style, background: gradient }}
                        >
                            <span className="bar-text text-nowrap text-black-50">
                                {range.formattedStart} - {range.formattedEnd}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StackedTimeline;
