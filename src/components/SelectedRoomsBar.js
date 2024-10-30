import React from 'react';

function SelectedRoomsBar({ selectedRooms, handleCheckout }) {

  return (
    <div className={`selected-rooms-bar fixed-bottom`}>
      {/* Toggle Button */}
      <div className="toggle-button" onClick={()=>handleCheckout()} hidden={selectedRooms.length < 1}>

        &nbsp;
        {<span> Continue with {selectedRooms.length} Selected Room{selectedRooms.length > 1 ? 's' : ''} </span>}
      </div>
    </div>
  );
};

export default SelectedRoomsBar;
