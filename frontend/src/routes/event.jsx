import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {getEvent, addAttendee, removeAttendee} from '../actions/event';
import { loadUser } from "./root";

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

export async function loader({ params }) {
  console.log('params :>> ', params);
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

const renderHeader = (user, attendees) => {
  let headers = [<th key="date">Date</th>, <th key="me">Me</th>];
  for (const [, attendee] of Object.entries(attendees)) {
    if (user.email === attendee.email){
      continue;
    }
    headers.push(<th key={attendee.email}>{attendee.name}</th>)
  }
  return headers;
}

const renderAttendees = (user, allAttendees, dateAttendees ) => {

  const columns = [];
  for (const [email, ] of Object.entries(allAttendees)) { 
    if (user.email === email){
      continue;
    }
    let found = false;
    if (dateAttendees !== undefined) {
      for (const a of dateAttendees.attendees) {
        if (email === a.email) {
          found = true;
        }
      }
    }

    if(found) {
      columns.push(
        <td>
          <img
            src="/icons/checkmark-64.png"
            alt="tick"
            width="32"
          />
        </td>
      );
    } else {
      columns.push(<td></td>);
    }

    return columns;
  }
};

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
                  <tr>{renderHeader(user, attendees)}</tr>
                </thead>
                <tbody>
                  {dates.map((date) => {
                    const year = date.getFullYear();
                    let month = date.getMonth() + 1;

                    let todaysDate = date.getDate();
                    if( month < 10){
                      month = "0" + month.toString();
                    }
                    if (todaysDate < 10) {
                      todaysDate = "0" + todaysDate.toString();
                    }

                    // See if checked
                    let checked = false;
                    const dateAttendees = event.dates[`${year}-${month}-${todaysDate}T00:00:00Z`];
                    if (dateAttendees !== undefined) {
                      const { email } = user;
                      for (const a of dateAttendees.attendees) {
                        console.log("a", a);
                        if (email === a.email) {
                          checked = true;
                        }
                      }
                    }

                    return (
                      <tr key={date}>
                        <td>
                          {days[date.getDay()]} {date.getDate()}/{date.getMonth() + 1}/
                          {date.getFullYear()}
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            value={`${year}-${month}-${todaysDate}T00:00:00.000Z`}
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
                        {renderAttendees(
                          user,
                          attendees,
                          event.dates[`${year}-${month}-${todaysDate}T00:00:00Z`]
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </figure>
          </section>
        </main>
      </>
  );
}
