import { React } from 'react';
import BackgroundImage from '../BackgroundImage';
import './HomePage.css'
import { Button } from 'reactstrap';

export default function HomePage() {

  const textOverlay = (
    <div className="overlay-text">
      <span className="overlay-text-primary">RESERVE A ROOM</span>
      <br />
      <div className="overlay-text-secondary">
        <p>Want to see what's available?</p>
        <Button outline className='text-overlay-btn' onClick={(e) => window.location.href = '/search-rooms'}>Begin your search here</Button>
        <p>Already have something in mind?</p>
        <Button outline className='text-overlay-btn' onClick={(e) => window.location.href = '/room-reservation-form'}>Take me directly to the form</Button>
      </div>
    </div>);

  return (
    <div>
      <BackgroundImage highRes={'/images/bg-1.jpg'} textOverlay={textOverlay} />
      <div className='info-section'>
        <div className='info-label'>
          DISCLAIMERS
        </div>
        {'For "SJCAC approved" events only (at San Jose and Willow Glen campuses).'}
        <br />
        SJCAC Church Administration reserves the right to approve or deny requests for room reservations.
        <br />
        All reservation requests must be submitted at least one week prior to the event date.
        <br />
        Please Include setup / clean up time in your request. Room bookings may be back to back.
        <br />
        For questions, contact rooms@sjcac.org
      </div>
      <div className='info-section'>
        <div className='info-label mb-3'>
          Upcoming Events
        </div>
        <iframe title="upcomingEvents" src="https://calendar.google.com/calendar/embed?src=c_8f9a221bd12882ccda21c5fb81effbad778854cc940c855b25086414babb1079%40group.calendar.google.com&ctz=America%2FLos_Angeles" style={{ border: 0 }} width="100%" height="650" frameborder="0" ></iframe>
      </div>
    </div>
  )
}