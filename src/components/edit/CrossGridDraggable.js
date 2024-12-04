import React, { useState } from "react";
import Draggable from "react-draggable";
import "./CrossGridDraggable.css";

const CrossGridDraggable = () => {
  const initialGrids = [
    { id: 1, name: "Grid 1", elements: [{ id: "1", name: "Element 1", row: 1 }, { id: "2", name: "Element 2", row: 2 }] },
    { id: 2, name: "Grid 2", elements: [{ id: "3", name: "Element 3", row: 1 }, { id: "4", name: "Element 4", row: 2 }] },
    { id: 3, name: "Grid 3", elements: [{ id: "5", name: "Element 5", row: 1 }, { id: "6", name: "Element 6", row: 2 }] },
  ];

  const [grids, setGrids] = useState(initialGrids);
  const [dragMode, setDragMode] = useState("x"); // 'x' for default mode, 'y' for move mode
  const [preview, setPreview] = useState(null); // Stores preview position (grid and row)

  const handleStop = (e, data, element, currentGridId) => {
    if (dragMode === "x") return; // Default mode doesn't need snapping logic

    // Calculate the grid and row for snapping
    const gridHeight = 120; // Each grid is 120px high
    const rowHeight = 40; // Each row is 40px
    const targetGridIndex = Math.floor((data.y + gridHeight / 2) / gridHeight);
    const targetGrid = grids[targetGridIndex];
    if (!targetGrid) return; // Out of bounds

    const relativeY = data.y % gridHeight; // Y position within the grid
    const targetRow = relativeY < rowHeight ? 1 : 2; // Snap to top or bottom row

    setGrids((prevGrids) => {
      const updatedGrids = prevGrids.map((grid) => {
        if (grid.id === currentGridId) {
          // Remove the element from the current grid
          return { ...grid, elements: grid.elements.filter((el) => el.id !== element.id) };
        } else if (grid.id === targetGrid.id) {
          // Add the element to the target grid with the updated row
          return { ...grid, elements: [...grid.elements, { ...element, row: targetRow }] };
        }
        return grid;
      });
      return updatedGrids;
    });

    setPreview(null); // Clear the preview
  };

  const handleDrag = (e, data, element) => {
    if (dragMode === "y") {
      // Calculate the grid and row for preview
      const gridHeight = 120;
      const rowHeight = 40;
      const targetGridIndex = Math.floor((data.y + gridHeight / 2) / gridHeight);
      const targetGrid = grids[targetGridIndex];
      if (!targetGrid) {
        setPreview(null); // Out of bounds
        return;
      }

      const relativeY = data.y % gridHeight;
      const targetRow = relativeY < rowHeight ? 1 : 2;

      setPreview({ gridId: targetGrid.id, row: targetRow });
    }
  };

  return (
    <div className="toggle-drag-container">
      <button onClick={() => setDragMode((prev) => (prev === "x" ? "y" : "x"))}>
        Toggle Drag Mode (Current: {dragMode === "x" ? "Default" : "Move"})
      </button>
      {grids.map((grid) => (
        <div key={grid.id} className="grid">
          <h4>{grid.name}</h4>
          <div className="grid-bar">
            {grid.elements.map((element) => (
              <Draggable
                key={element.id}
                axis={dragMode}
                bounds={dragMode === "x" ? "parent" : null}
                position={null} // Let Draggable control its position
                onDrag={(e, data) => handleDrag(e, data, element)}
                onStop={(e, data) => handleStop(e, data, element, grid.id)}
              >
                <div
                  className="draggable-element"
                  style={{
                    top: `${element.row === 1 ? 10 : 50}px`, // Snap to respective row
                  }}
                >
                  {element.name}
                </div>
              </Draggable>
            ))}
            {preview?.gridId === grid.id && (
              <div
                className="preview-element"
                style={{
                  top: `${preview.row === 1 ? 10 : 50}px`,
                }}
              >
                Preview
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CrossGridDraggable;
