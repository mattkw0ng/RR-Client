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
        <div className='info-label mb-3'>
          Upcoming Events
        </div>
        <iframe title="upcomingEvents" src="https://calendar.google.com/calendar/embed?src=c_8f9a221bd12882ccda21c5fb81effbad778854cc940c855b25086414babb1079%40group.calendar.google.com&ctz=America%2FLos_Angeles" style={{ border: 0 }} width="100%" height="650" frameborder="0" ></iframe>
      </div>
      <div className='info-section'>
        <div className='info-label'>
          DISCLAIMERS
        </div>
        {'For "SJCAC approved" events only (at San Jose and Willow Glen campuses).'}
        <br />
        Room requests are for "SJCAC approved" events only (at East and West campuses) and are mostly first come, first served with exceptions for church-wide ministries.
        <br />
        All reservation requests must be submitted at least one week prior to the event date to allow time for processing approvals and conflicts.
        <br />
        Room/Campus access:  Be sure to arrange with a keyholder to unlock/lock doors for your meeting. (keyholders: Ministry leaders, Worship Leaders, some Ministry assistants, office staff) If West campus key is needed, key access via lockbox can be requested.
        <br />
        Include setup / clean up time in your request as some room bookings may be scheduled back to back. If your group's meeting runs past your meeting end time, the next group may enter and give a reminder that they have the following reservation and are waiting to begin.
        <br />
        Cancel any change of plans as soon as possible to make the room(s) available to other groups.
        <br />
        Recurring reservations are limited to a 6 month window.
        <br />
        For questions, email rooms@sjcac.org
      </div>
    </div>
  )
}