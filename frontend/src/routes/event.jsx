import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {getEvent, addAttendee, removeAttendee} from '../actions/event';
import Signup from "../components/signup";
import { loadUser } from "./root";

// TODO Could add the event hash of the user to the localstorage so that it is semi-persistent

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

const renderAttendeeRows = (user, allAttendees, dates, event, setEvent, setModalOpen) => {
  const rows = [];
  console.log('user', user);
  for (const [email, attendee ] of Object.entries(allAttendees)) { 
    if (user.email === email){
      continue; // Skip the user so we can render their row at the end
    }
    const {name} = attendee;
    
    const attendeeDates = dates.map((date) => {
      let found = false;
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      const dayOfWeek = date.getDay();

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
      console.log('dayOfWeek', dayOfWeek);
      if(found) {
        return(
          <td key={`${name}-${date}`} className={dayOfWeek === 6 || dayOfWeek === 0 ? "weekend" : null }>
            <img
              src="/icons/checkmark-64.png"
              alt="tick"
              width="32"
            />
          </td>
        );
      } else {
        return (
          <td
            className={dayOfWeek === 6 || dayOfWeek === 0 ? "weekend" : null}
          ></td>
        );
      }
    });

    rows.push(<tr key={email}>{[<td key={attendee}>{name}</td>, ...attendeeDates]}</tr>)
  }
  // 
  if (user.accountCreated) {
    // Now add the user row
    const userDates = dates.map((date) => {
      const dayOfWeek = date.getDay();
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
        <td
          key={`${user.email}-${date}`}
          className={dayOfWeek === 6 || dayOfWeek === 0 ? "weekend" : null}
        >
          <input
            type="checkbox"
            value={`${year}-${month}-${theDate}T00:00:00.000Z`}
            onChange={(e) => {
              const checked = e.target.checked;
              checked
                ? add({
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
    rows.push(<tr key={user.email}>{[<td key={user}>{user.name}</td>, ...userDates]}</tr>);
  } else {
    // Show the signup row
    rows.push(
      <tr key="Signup-row">
        <td>Me</td>
        <td colspan="3">
          <button
            class="contrast"
            data-target="modal-example"
            onClick={() => setModalOpen(true)}
          >
            Enter My Dates
          </button>
        </td>
        <td colspan={dates.length - 3}>&nbsp;</td>
      </tr>
    );
  }
  return rows;
}

export default function Event() {
  const [modalOpen, setModalOpen] = useState(false);
  const e = useLoaderData();
  const [event, setEvent] = useState(e);
  const user = loadUser();
  console.log('event', event);
  const dates = [];
  const today = new Date();
  const daysToAdd = 45;
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
            <li>
              <Link to={`/`}>Home</Link>
            </li>
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
                {renderAttendeeRows(
                  user,
                  attendees,
                  dates,
                  event,
                  setEvent,
                  setModalOpen
                )}
              </tbody>
            </table>
          </figure>
        </section>
      </main>
      <dialog id="modal-example" open={modalOpen ? "open" : null}>
        <article>
          <a
            href="#close"
            aria-label="Close"
            class="close"
            data-target="modal-example"
            onClick={() => setModalOpen(false)}
          ></a>
          <Signup name="" email="" callback={() => setModalOpen(false)} />
        </article>
      </dialog>
    </>
  );
}
