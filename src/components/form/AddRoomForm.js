import React, { useState } from 'react';
// import { useRooms } from '../../context/RoomsContext';
import TextInput from './TextInput';
import TextArea from './TextArea';

export default function AddRoomForm({ }) {
  // const { rooms } = useRooms();
  const { formData, setFormData } = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data: ", formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label={"Room Name"} name={'room_name'} handleFormChange={handleFormChange} formData={formData} />
      <TextInput label={"CalendarId"} name={'calendar_id'} handleFormChange={handleFormChange} formData={formData} />
      <TextInput label={"Capacity"} name={'capacity'} handleFormChange={handleFormChange} formData={formData} type='number'/>
      <TextArea label={"Resources (comma separated)"} name={'resources'} handleFormChange={handleFormChange} formData={formData} />
      <TextInput label={"Building Location"} name={'building_location'} handleFormChange={handleFormChange} formData={formData} />
    </form>
  );
}