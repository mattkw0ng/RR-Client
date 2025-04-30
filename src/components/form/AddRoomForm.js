import React, { useEffect, useState } from 'react';
import { useRooms } from '../../context/RoomsContext';
import TextInput from './TextInput';
import TextArea from './TextArea';

export default function AddRoomForm() {
  const { rooms} = useRooms();

  const [selectedBuilding, setSelectedBuilding] = useState();
  const [customBuilding, setCustomBuilding] = useState('');
  

  const [formData, setFormData] = useState({
    room_name: "",
    calendar_id: "",
    capacity: "",
    resources: "",
  });
  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const onSubmit = (data) => {
    console.log(errors);
    console.log(data);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    console.log("Submitting form data: ", formData);

    // Validate calendar_id
    if (!formData.calendar_id.endsWith("@resource.calendar.google.com")) {
      newErrors.calendar_id =
        "Calendar ID must end with '@resource.calendar.google.com'";
    }

    // Validate capacity (must be a positive integer)
    if (formData.capacity && (!/^\d+$/.test(formData.capacity) || parseInt(formData.capacity, 10) <= 0)) {
      newErrors.capacity = "Capacity must be a positive number.";
    }

    // Validate resources (split by commas, must not be empty)
    const resourcesArray = formData.resources
      .split(",")
      .map((res) => res.trim())
      .filter((res) => res);
    if (formData.resources && resourcesArray.length === 0) {
      newErrors.resources = "Please provide at least one resource.";
    }

    // Validate new building input if selected
    if (selectedBuilding === '') {
      newErrors.newBuilding = "Please select a building"
    }
    const finalBuilding = selectedBuilding !== 'Other' ? selectedBuilding : customBuilding;

    // If there are errors, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare final data
    const finalData = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
      resources: resourcesArray,
      building_location: finalBuilding,
    };

    // Send data to parent component
    onSubmit(finalData);

    // Clear form
    setFormData({
      room_name: "",
      calendar_id: "",
      capacity: "",
      resources: "",
    });
    setErrors({});
  };

  useEffect(() => {
    console.log("Logging roomsGrouped:", rooms);
  }, [rooms])

  const handleSetBuilding = (e) => {
    setSelectedBuilding(e.target.value)
    if (e.target.value !== 'Other') {
      setCustomBuilding('')
    }
  }

  const handleCustomBuildingChange = (e) => {
    setCustomBuilding(e.target.value);
  }

  const BuildingSelector = ({ selectedBuilding, handleSetBuilding, customBuilding, handleCustomBuildingChange, rooms }) => {
    const existingBuildings = Object.keys(rooms?.roomsGrouped || {});

    return (
      <div className='form-group'>
        <label htmlFor='buildingSelect'>Building Location</label>
        <select className='form-select'
          id='buildingSelect'
          name='buildingSelect'
          value={selectedBuilding}
          onChange={handleSetBuilding}
        >
          <option value={""}>Select a building...</option>
          {existingBuildings.map((building, idx) => (
            <option key={"building"+idx} value={building}>{building}</option>
          ))}
          <option value="Other">Other</option>
        </select>

        {selectedBuilding === "Other" && (
          <div>
            <label htmlFor="customBuilding" className='form-label'>New Building Name</label>
            <input type='text'
              id='customBuilding'
              name='customBuilding'
              className='form-control'
              value={customBuilding}
              onChange={handleCustomBuildingChange}
              placeholder='Enter new buidling name'  
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='containter'>
      <div className='my-4'>
        <h1 className="mb-0">Add Room Form</h1>
        <small className='text-italic'>** You must use Google to create the room first. Use the assigned calendarId to complete this form.</small>
      </div>
      <form onSubmit={handleSubmit} className='p-3'>
        <TextInput label={"Room Name"} name={'room_name'} labelSmallText={'This will be the display name used everywhere else on this site'} handleFormChange={handleFormChange} formData={formData} />
        <TextInput label={"CalendarId"} name={'calendar_id'} handleFormChange={handleFormChange} formData={formData} />
        <TextInput label={"Capacity"} name={'capacity'} handleFormChange={handleFormChange} formData={formData} type='number' />
        <TextArea label={"Resources (comma separated)"} name={'resources'} help={'i.e. Chairs, TV, Piano, A/V Sound System, Keyboard, Drums, Podium, Microphones'} handleFormChange={handleFormChange} formData={formData} />
        <BuildingSelector selectedBuilding={selectedBuilding} handleSetBuilding={handleSetBuilding} customBuilding={customBuilding} handleCustomBuildingChange={handleCustomBuildingChange} rooms={rooms}/>
      </form>
    </div>
  );
}