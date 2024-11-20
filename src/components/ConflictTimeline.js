import React from 'react';
import './Timeline.css'; // Custom styles

const Timeline = ({ timeRanges }) => {
    // Helper function to calculate percentage width/position
    const calculatePosition = (start, end, rangeStart, rangeEnd) => {
        const totalDuration = rangeEnd - rangeStart;
        const startOffset = ((start - rangeStart) / totalDuration) * 100;
        const width = ((end - start) / totalDuration) * 100;
        return { left: `${startOffset}%`, width: `${width}%` };
    };

    // Parse time ranges
    const parsedRanges = timeRanges.map(({ start, end }) => ({
        start: new Date(start.dateTime).getTime(),
        end: new Date(end.dateTime).getTime(),
    }));

    // Calculate the full timeline range
    const rangeStart = Math.min(...parsedRanges.map(range => range.start));
    const rangeEnd = Math.max(...parsedRanges.map(range => range.end));

    // Calculate overlap
    const overlapStart = Math.max(...parsedRanges.map(range => range.start));
    const overlapEnd = Math.min(...parsedRanges.map(range => range.end));
    const isOverlapping = overlapStart < overlapEnd;

    return (
        <div className="timeline">
            {/* Timeline scale */}
            <div className="timeline-scale">
                <span>{new Date(rangeStart).toLocaleTimeString()}</span>
                <span>{new Date(rangeEnd).toLocaleTimeString()}</span>
            </div>

            {/* Bars for each time range */}
            <div className="timeline-bars">
                {parsedRanges.map((range, index) => {
                    const style = calculatePosition(range.start, range.end, rangeStart, rangeEnd);
                    return (
                        <div
                            key={index}
                            className="timeline-bar"
                            style={style}
                        ></div>
                    );
                })}

                {/* Highlight overlap */}
                {isOverlapping && (
                    <div
                        className="timeline-overlap"
                        style={calculatePosition(overlapStart, overlapEnd, rangeStart, rangeEnd)}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default Timeline;


