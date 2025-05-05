import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { useRooms } from '../../context/RoomsContext';
import TextInput from './TextInput';
import TextArea from './TextArea';
import BuildingSelector from './BuildingSelector';

export default function AddRoomForm() {
  const { rooms } = useRooms();

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

  const onSubmit = async (data) => {
    console.log(errors);
    console.log(data);
    // Handle form submission logic here
    await axios.post(API_URL + "/api/addRoom", data, { withCredentials: true })
      .then((response) => {
        console.log("Room added successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding room:", error);
      });
    setSelectedBuilding('');
    setCustomBuilding('');
    setFormData({
      room_name: "",
      calendar_id: "",
      capacity: "",
      resources: "",
    });
    setErrors({});
    console.log("Form submitted successfully with data:", data);
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

    // Submit data
    onSubmit(finalData);
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

  // log errors on formData change
  useEffect(() => {
    console.log("Errors: ", errors);
    console.log("FormData: ", formData);
  }, [errors, formData]);

  return (
    <div className='containter'>
      <div className='my-4'>
        <h1 className="mb-0">Add Room Form</h1>
        <small className='text-italic'>** You must use Google to create the room first. Use the assigned calendarId to complete this form.</small>
      </div>
      <form onSubmit={handleSubmit} className='p-3'>
        <TextInput label={"Room Name"} name={'room_name'} labelSmallText={'This will be the display name used everywhere else on this site'} handleFormChange={handleFormChange} formData={formData} />
        <TextInput label={"CalendarId"} name={'calendar_id'} labelSmallText={'i.e. c_188bjq4ulhi5ohdmirsc68et3g0f8@resource.calendar.google.com'} handleFormChange={handleFormChange} formData={formData} />
        <TextInput label={"Capacity"} name={'capacity'} handleFormChange={handleFormChange} formData={formData} type='number' />
        <TextArea label={"Resources (comma separated)"} name={'resources'} help={'i.e. Chairs, TV, Piano, A/V Sound System, Keyboard, Drums, Podium, Microphones'} handleFormChange={handleFormChange} formData={formData} />
        <BuildingSelector selectedBuilding={selectedBuilding} handleSetBuilding={handleSetBuilding} customBuilding={customBuilding} handleCustomBuildingChange={handleCustomBuildingChange} rooms={rooms} />
        <button type='submit' disabled={Object.keys(errors).length === 0} className='btn btn-primary mt-3'>Submit</button>
        {errors.calendar_id && <div className="text-danger">{errors.calendar_id}</div>}
        {errors.capacity && <div className="text-danger">{errors.capacity}</div>}
        {errors.resources && <div className="text-danger">{errors.resources}</div>}
        {errors.newBuilding && <div className="text-danger">{errors.newBuilding}</div>}
        {Object.keys(errors).length > 0 && <div className="text-danger">Please fix the errors above.</div>}
        <div className='text-secondary text-italic mt-3'>
          <p>Note: If you are adding a new building, please ensure it is not already in the list of buildings. If it is, select the existing building instead.</p>
          <p>Also, please ensure that the calendarId is correct and that the room has been created in Google Calendar before submitting this form.</p>
          <p>Thank you for your cooperation!</p>
        </div>
      </form>
    </div>
  );
}