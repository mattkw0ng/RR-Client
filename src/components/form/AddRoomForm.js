import React, { useEffect, useState } from 'react';
// import { useRooms } from '../../context/RoomsContext';
import TextInput from './TextInput';
import TextArea from './TextArea';

export default function AddRoomForm() {
  // const { rooms } = useRooms();
  const [formData, setFormData] = useState({
    room_name: "",
    calendar_id: "",
    capacity: "",
    resources: "",
    building_location: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const onSubmit = (data) => {
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
    let finalBuilding = formData.building_location;
    if (formData.building_location === "new" && formData.newBuilding.trim() === "") {
      newErrors.newBuilding = "Please enter a new building name.";
    } else if (formData.building_location === "new") {
      finalBuilding = formData.newBuilding.trim();
    }

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
      building_location: existingBuildings.length > 0 ? existingBuildings[0] : "",
      newBuilding: "",
    });
    setErrors({});
  };

  useEffect(() => {
    console.log("Logging Form Data bc it is not working for some reason:", formData, formData['room_name']);
  }, [formData])

  return (
    <div className='containter'>
      <div className='my-4'>
        <h1 className="mb-0">Add Room Form</h1>
        <small className='text-italic'>** You must use Google to create the room first. Use the assigned calendarId to complete this form.</small>
      </div>
      <form onSubmit={handleSubmit} className='p-3'>
        <TextInput label={"Room Name"} name={'room_name'} handleFormChange={handleFormChange} formData={formData} />
        <TextInput label={"CalendarId"} name={'calendar_id'} handleFormChange={handleFormChange} formData={formData} />
        <TextInput label={"Capacity"} name={'capacity'} handleFormChange={handleFormChange} formData={formData} type='number' />
        <TextArea label={"Resources (comma separated)"} name={'resources'} help={'Chairs, TV, Piano, A/V Sound System, Keyboard, Drums, Podium, Microphones'} handleFormChange={handleFormChange} formData={formData} />
        <TextInput label={"Building Location"} name={'building_location'} handleFormChange={handleFormChange} formData={formData} />
      </form>
    </div>
  );
}