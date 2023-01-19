import { Link, useLoaderData } from "react-router-dom";
import {getEvent} from '../actions/event';

export async function loader({ params }) {
  const event = getEvent(params.eventId);
  console.log('loader event', event);
  return event;
}

export async function addAttendee() {

}

export async function removeAttendee() {
  
}

export default function Event() {
  const event = useLoaderData();

  const dates = [];
  const today = new Date();
  const daysToAdd = 60;
  for (let i = 0; i < daysToAdd; i++){
    var date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <div>
      <Link to={`/`}>Home</Link>
      <h1>Event Details</h1>
      <h2>Title: {event.Title}</h2>
      <p>
        <strong>Description: </strong>
        {event.Description}
      </p>
      <h2>Availability</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Me</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((date) => {
            return (
              <tr key={date}>
                <td>
                  {days[date.getDay()]} {date.getDate()}/{date.getMonth()}/
                  {date.getFullYear()}
                </td>
                <td>
                  <input type="checkbox" value={date} onChange={(e)=> {
                    console.log('checked:', e.target.checked);
                    console.log("checked:", e.target.value);
                  }}/>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
