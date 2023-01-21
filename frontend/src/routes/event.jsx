import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {getEvent, addAttendee, removeAttendee} from '../actions/event';
import { loadUser } from "./root";

  const days = [
    "Sun",
    "Mon",
    "Tues",
    "Weds",
    "Thurs",
    "Fri",
    "Sat",
    "Sun",
  ];

export async function loader({ params }) {

  const event = getEvent(params.eventId);
  console.log('loader event', event);
  return event;
}

export async function add(data) {
  return await addAttendee(data);
}

export async function remove(data) {
  return await removeAttendee(data);
}

const renderHeader = (dates) => {
  const headers = dates.map((date) => {
    const month = date.getMonth() + 1;
    return(<th key={date}>{days[date.getDay()]}<br />{date.getDate()}/{month}</th>);
  });
  return [<th key="attendees">Attendees</th>, ...headers];
}

const renderAttendeeRows = (user, allAttendees, dates, event, setEvent) => {
  const rows = [];

  for (const [email, attendee ] of Object.entries(allAttendees)) { 
    if (user.email === email){
      continue;
    }
    const {name} = attendee;
    
    const attendeeDates = dates.map((date) => {
      let found = false;
      const year = date.getFullYear();
      let month = date.getMonth() + 1;

      let theDate = date.getDate();
      if( month < 10){
        month = "0" + month.toString();
      }
      if (theDate < 10) {
        theDate = "0" + theDate.toString();
      }

      // See if checked for the attendee
      const theDateServerFmt = `${year}-${month}-${theDate}T00:00:00Z`;
      const dateAttendees = event.dates[theDateServerFmt];
      if (dateAttendees !== undefined) {
        for (const a of dateAttendees.attendees) {
          if (email === a.email) {
            found = true;
          }
        }
      }

      if(found) {
        return(
          <td key={`${name}-${date}`}>
            <img
              src="/icons/checkmark-64.png"
              alt="tick"
              width="32"
            />
          </td>
        );
      } else {
        return (<td></td>);
      }
    });

    rows.push(<tr key={email}>{[<td key={attendee}>{name}</td>, ...attendeeDates]}</tr>)
  }

  // Now add the user row
  const userDates = dates.map((date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;

    let theDate = date.getDate();
    if( month < 10){
      month = "0" + month.toString();
    }
    if (theDate < 10) {
      theDate = "0" + theDate.toString();
    }

    // See if checked
    let checked = false;
    const dateAttendees = event.dates[`${year}-${month}-${theDate}T00:00:00Z`];
    if (dateAttendees !== undefined) {
      const { email } = user;
      for (const a of dateAttendees.attendees) {
        if (email === a.email) {
          checked = true;
        }
      }
    }
    return (
      <td key={`${user.email}-${date}`}>
        <input
          type="checkbox"
          value={`${year}-${month}-${theDate}T00:00:00.000Z`}
          onChange={(e) => {
            const checked = e.target.checked
            checked
              ? 
                add({
                  hash: event.hash,
                  ...user,
                  date: e.target.value,
                }).then((newEvent) => {
                  if (newEvent !== false) {
                    setEvent(newEvent);
                  }
                })
              : removeAttendee({
                hash: event.hash,
                ...user,
                date: e.target.value,
              }).then((newEvent) => {
                if (newEvent !== false) {
                  setEvent(newEvent);
                }
              });
          }}
          checked={checked}
        />
      </td>
    );
  })
  rows.push(<tr key={user.email}>{[<td key={user}>{user.name}</td>, ...userDates]}</tr>)
  return rows;
}

export default function Event() {
  const e = useLoaderData();
  const [event, setEvent] = useState(e);
  const user = loadUser();
  console.log('event', event);
  const dates = [];
  const today = new Date();
  const daysToAdd = 20;
  for (let i = 0; i < daysToAdd; i++){
    var date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  // Extract the attendees
  const attendees = [];
  
  // Unique list of attendees
  for (const [, value] of Object.entries(event.dates)) {
    for (const a of value.attendees) {
      if (!attendees.includes(a.email)) {
        attendees[a.email] = a;
      }
    }
  }


  console.log('attendees', attendees);

  return (
      <>
        <header className="container">
          <hgroup>
            <h1>Event: {event.title}</h1>
          </hgroup>
          <nav>
          <ul>
            <li><Link to={`/`}>Home</Link></li>
          </ul>
        </nav>
        </header>
        
        
        <main className="container">
          <section id="eventDescription">
            <p>
              <strong>Description: </strong>
              {event.description}
            </p>
          </section>
          <section id="availability">
            <h2>Availability</h2>
            <figure>
              <table>
                <thead>
                  <tr>{renderHeader(dates)}</tr>
                </thead>
                <tbody>
                  {renderAttendeeRows(user, attendees, dates, event, setEvent)}
                </tbody>
              </table>
            </figure>
          </section>
        </main>
      </>
  );
}
