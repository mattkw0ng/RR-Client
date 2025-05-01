import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody } from "reactstrap";
import API_URL from "../../config";
import { getRoomNameByCalendarID } from "../../util/util";
import { useRooms } from "../../context/RoomsContext";
import ViewEventDetails from "../view/ViewEventDetails";

export default function Home() {
  const { rooms } = useRooms();
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchApprovedEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/approvedEvents', { withCredentials: true });
      setApprovedEvents(response.data);
    } catch (error) {
      console.error('Error fetching approved events:', error);
    }
  };

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }

  const toggleModal = (event = null) => {
    setSelectedEvent(event);
    setModal(!modal);
  };

  return (
    <Fragment>
      <iframe title="upcomingEvents" src="https://calendar.google.com/calendar/embed?src=c_8f9a221bd12882ccda21c5fb81effbad778854cc940c855b25086414babb1079%40group.calendar.google.com&ctz=America%2FLos_Angeles" style={{ border: 0 }} width="100%" height="650" frameBorder="0"></iframe>

      <div>
        <h4>Upcoming Events</h4>
        <ListGroup>
          {approvedEvents.map(group => (
            <div key={group.date}>
              <hr />
              <p>{formatDate(group.date)}</p>
              {group.events.map(event => (
                <ListGroupItem 
                  key={event.id} 
                  onClick={() => toggleModal(event)} 
                  style={{ cursor: "pointer" }}
                >
                  <h4>{event.summary}</h4>
                  <p className="mb-0">{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}</p>
                  <small className="text-italic">
                    {
                      event.attendees?.filter((a) => a.resource === true)
                        .map((attendee) => (getRoomNameByCalendarID(attendee.email, rooms)))
                        .join(", ")
                    }
                  </small>
                  <p>{event.description}</p>
                </ListGroupItem>
              ))}
            </div>
          ))}
        </ListGroup>
      </div>

      {/* ViewerModal */}
      <Modal isOpen={modal} toggle={toggleModal} size='xl'>
        <ModalHeader toggle={toggleModal}>
          <span className='text-secondary'>{selectedEvent?.summary}</span>
        </ModalHeader>
        <ModalBody className='px-3'>
          {selectedEvent && <ViewEventDetails event={selectedEvent} rooms={rooms} />}
        </ModalBody>
      </Modal>
    </Fragment>
  );
}