import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { getEvent, addAttendee, removeAttendee } from "../actions/event";
import Signup from "../components/signup";
import { loadUser } from "./root";

// TODO Could add the event hash of the user to the localStorage so that it is semi-persistent

const days = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function loader({ params }) {
  const event = getEvent(params.eventId);
  return event;
}

export async function add(data) {
  return await addAttendee(data);
}

export async function remove(data) {
  return await removeAttendee(data);
}

const renderHeader = (dates, eventDates) => {
  const headers = dates.map((date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month.toString();
    }

    let theDate = date.getDate();
    if (theDate < 10) {
      theDate = "0" + theDate.toString();
    }

    const theDateServerFmt = `${year}-${month}-${theDate}T00:00:00Z`;
    const dateAttendees = eventDates[theDateServerFmt];

    return (
      <th key={`th-${date}`}>
        <div key={date} className="header-option">
          <div>
            <div className="header-option-month">{months[date.getMonth()]}</div>
            <div className="header-option-day">{date.getDate()}</div>
            <div className="header-option-dotw">{days[date.getDay()]}</div>
          </div>
          <div className="header-option-participants">
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.3 12.22C12.8336 11.7581 13.2616 11.1869 13.5549 10.545C13.8482 9.90316 14 9.20571 14 8.5C14 7.17392 13.4732 5.90215 12.5355 4.96447C11.5979 4.02678 10.3261 3.5 9 3.5C7.67392 3.5 6.40215 4.02678 5.46447 4.96447C4.52678 5.90215 4 7.17392 4 8.5C3.99999 9.20571 4.1518 9.90316 4.44513 10.545C4.73845 11.1869 5.16642 11.7581 5.7 12.22C4.30014 12.8539 3.11247 13.8775 2.27898 15.1685C1.4455 16.4596 1.00147 17.9633 1 19.5C1 19.7652 1.10536 20.0196 1.29289 20.2071C1.48043 20.3946 1.73478 20.5 2 20.5C2.26522 20.5 2.51957 20.3946 2.70711 20.2071C2.89464 20.0196 3 19.7652 3 19.5C3 17.9087 3.63214 16.3826 4.75736 15.2574C5.88258 14.1321 7.4087 13.5 9 13.5C10.5913 13.5 12.1174 14.1321 13.2426 15.2574C14.3679 16.3826 15 17.9087 15 19.5C15 19.7652 15.1054 20.0196 15.2929 20.2071C15.4804 20.3946 15.7348 20.5 16 20.5C16.2652 20.5 16.5196 20.3946 16.7071 20.2071C16.8946 20.0196 17 19.7652 17 19.5C16.9985 17.9633 16.5545 16.4596 15.721 15.1685C14.8875 13.8775 13.6999 12.8539 12.3 12.22ZM9 11.5C8.40666 11.5 7.82664 11.3241 7.33329 10.9944C6.83994 10.6648 6.45542 10.1962 6.22836 9.64805C6.0013 9.09987 5.94189 8.49667 6.05764 7.91473C6.1734 7.33279 6.45912 6.79824 6.87868 6.37868C7.29824 5.95912 7.83279 5.6734 8.41473 5.55764C8.99667 5.44189 9.59987 5.5013 10.1481 5.72836C10.6962 5.95542 11.1648 6.33994 11.4944 6.83329C11.8241 7.32664 12 7.90666 12 8.5C12 9.29565 11.6839 10.0587 11.1213 10.6213C10.5587 11.1839 9.79565 11.5 9 11.5ZM18.74 11.82C19.38 11.0993 19.798 10.2091 19.9438 9.25634C20.0896 8.30362 19.9569 7.32907 19.5618 6.45C19.1666 5.57093 18.5258 4.8248 17.7165 4.30142C16.9071 3.77805 15.9638 3.49974 15 3.5C14.7348 3.5 14.4804 3.60536 14.2929 3.79289C14.1054 3.98043 14 4.23478 14 4.5C14 4.76522 14.1054 5.01957 14.2929 5.20711C14.4804 5.39464 14.7348 5.5 15 5.5C15.7956 5.5 16.5587 5.81607 17.1213 6.37868C17.6839 6.94129 18 7.70435 18 8.5C17.9986 9.02524 17.8593 9.5409 17.5961 9.99542C17.3328 10.4499 16.9549 10.8274 16.5 11.09C16.3517 11.1755 16.2279 11.2977 16.1404 11.4447C16.0528 11.5918 16.0045 11.7589 16 11.93C15.9958 12.0998 16.0349 12.2678 16.1137 12.4183C16.1924 12.5687 16.3081 12.6967 16.45 12.79L16.84 13.05L16.97 13.12C18.1754 13.6917 19.1923 14.596 19.901 15.7263C20.6096 16.8566 20.9805 18.1659 20.97 19.5C20.97 19.7652 21.0754 20.0196 21.2629 20.2071C21.4504 20.3946 21.7048 20.5 21.97 20.5C22.2352 20.5 22.4896 20.3946 22.6771 20.2071C22.8646 20.0196 22.97 19.7652 22.97 19.5C22.9782 17.9654 22.5938 16.4543 21.8535 15.1101C21.1131 13.7659 20.0413 12.6333 18.74 11.82Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="header-option-participants-counter">
              {dateAttendees !== undefined ? dateAttendees.attendees.length : 0}
            </div>
          </div>
        </div>
      </th>
    );
  });

  return [
    <th key="static-th" className="sticky inset-0 bg-white">
      <div className="mr-1 mb-1 flex h-40 items-end justify-start px-2 md:h-48 md:w-48">
        <h2 className="hidden text-sm font-semibold text-grey-900 md:block md:text-lg">
          Participants
        </h2>
      </div>
    </th>,
    ...headers,
  ];
};

const renderAttendeeRows = (
  user,
  allAttendees,
  dates,
  event,
  setEvent,
  setModalOpen
) => {
  const rows = [];
  for (const [email, attendee] of Object.entries(allAttendees)) {
    if (user.email === email) {
      continue; // Skip the user so we can render their row at the end
    }
    const { name } = attendee;

    const attendeeDates = dates.map((date) => {
      let found = false;
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      const dayOfWeek = date.getDay();

      let theDate = date.getDate();
      if (month < 10) {
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

      if (found) {
        return (
          <td
            key={`${name}-${date}`}
            className={dayOfWeek === 6 || dayOfWeek === 0 ? "weekend" : null}
          >
            <div className="user-selection available">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.7099 7.21C18.617 7.11627 18.5064 7.04188 18.3845 6.99111C18.2627 6.94034 18.132 6.9142 17.9999 6.9142C17.8679 6.9142 17.7372 6.94034 17.6154 6.99111C17.4935 7.04188 17.3829 7.11627 17.29 7.21L9.83995 14.67L6.70995 11.53C6.61343 11.4368 6.49949 11.3634 6.37463 11.3142C6.24978 11.265 6.11645 11.2409 5.98227 11.2432C5.84809 11.2456 5.71568 11.2743 5.5926 11.3278C5.46953 11.3813 5.35819 11.4585 5.26495 11.555C5.17171 11.6515 5.0984 11.7655 5.04919 11.8903C4.99999 12.0152 4.97586 12.1485 4.97818 12.2827C4.9805 12.4169 5.00923 12.5493 5.06272 12.6723C5.11622 12.7954 5.19343 12.9068 5.28995 13L9.12995 16.84C9.22291 16.9337 9.33351 17.0081 9.45537 17.0589C9.57723 17.1097 9.70794 17.1358 9.83995 17.1358C9.97196 17.1358 10.1027 17.1097 10.2245 17.0589C10.3464 17.0081 10.457 16.9337 10.55 16.84L18.7099 8.68C18.8115 8.58636 18.8925 8.4727 18.9479 8.3462C19.0033 8.21971 19.0319 8.0831 19.0319 7.945C19.0319 7.8069 19.0033 7.67029 18.9479 7.54379C18.8925 7.41729 18.8115 7.30364 18.7099 7.21Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </td>
        );
      } else {
        return (
          <td
            key={`empty-${date}`}
            className={dayOfWeek === 6 || dayOfWeek === 0 ? "weekend" : null}
          >
            <div className="user-selection not-available">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.4099 11.9999L17.7099 7.70994C17.8982 7.52164 18.004 7.26624 18.004 6.99994C18.004 6.73364 17.8982 6.47825 17.7099 6.28994C17.5216 6.10164 17.2662 5.99585 16.9999 5.99585C16.7336 5.99585 16.4782 6.10164 16.2899 6.28994L11.9999 10.5899L7.70994 6.28994C7.52164 6.10164 7.26624 5.99585 6.99994 5.99585C6.73364 5.99585 6.47824 6.10164 6.28994 6.28994C6.10164 6.47825 5.99585 6.73364 5.99585 6.99994C5.99585 7.26624 6.10164 7.52164 6.28994 7.70994L10.5899 11.9999L6.28994 16.2899C6.19621 16.3829 6.12182 16.4935 6.07105 16.6154C6.02028 16.7372 5.99414 16.8679 5.99414 16.9999C5.99414 17.132 6.02028 17.2627 6.07105 17.3845C6.12182 17.5064 6.19621 17.617 6.28994 17.7099C6.3829 17.8037 6.4935 17.8781 6.61536 17.9288C6.73722 17.9796 6.86793 18.0057 6.99994 18.0057C7.13195 18.0057 7.26266 17.9796 7.38452 17.9288C7.50638 17.8781 7.61698 17.8037 7.70994 17.7099L11.9999 13.4099L16.2899 17.7099C16.3829 17.8037 16.4935 17.8781 16.6154 17.9288C16.7372 17.9796 16.8679 18.0057 16.9999 18.0057C17.132 18.0057 17.2627 17.9796 17.3845 17.9288C17.5064 17.8781 17.617 17.8037 17.7099 17.7099C17.8037 17.617 17.8781 17.5064 17.9288 17.3845C17.9796 17.2627 18.0057 17.132 18.0057 16.9999C18.0057 16.8679 17.9796 16.7372 17.9288 16.6154C17.8781 16.4935 17.8037 16.3829 17.7099 16.2899L13.4099 11.9999Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </td>
        );
      }
    });

    rows.push(
      <tr key={email} className="user-row">
        {[
          <th key={attendee} className="sticky inset-0 bg-white px-2">
            <div className="flex items-center">
              <div className="user-avatar">M</div>
              <div className="user-name">{name}</div>
            </div>
          </th>,
          ...attendeeDates,
        ]}
      </tr>
    );
  }
  //
  if (user.accountCreated) {
    // Now add the user row
    const userDates = dates.map((date) => {
      const dayOfWeek = date.getDay();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;

      let theDate = date.getDate();
      if (month < 10) {
        month = "0" + month.toString();
      }
      if (theDate < 10) {
        theDate = "0" + theDate.toString();
      }

      // See if checked
      let checked = false;
      const dateAttendees =
        event.dates[`${year}-${month}-${theDate}T00:00:00Z`];
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
          <div className={checked ? "user-option checked" : "user-option"}>
            <div className="flex">
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
              <div className="checkbox">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7099 7.21C18.617 7.11627 18.5064 7.04188 18.3845 6.99111C18.2627 6.94034 18.132 6.9142 17.9999 6.9142C17.8679 6.9142 17.7372 6.94034 17.6154 6.99111C17.4935 7.04188 17.3829 7.11627 17.29 7.21L9.83995 14.67L6.70995 11.53C6.61343 11.4368 6.49949 11.3634 6.37463 11.3142C6.24978 11.265 6.11645 11.2409 5.98227 11.2432C5.84809 11.2456 5.71568 11.2743 5.5926 11.3278C5.46953 11.3813 5.35819 11.4585 5.26495 11.555C5.17171 11.6515 5.0984 11.7655 5.04919 11.8903C4.99999 12.0152 4.97586 12.1485 4.97818 12.2827C4.9805 12.4169 5.00923 12.5493 5.06272 12.6723C5.11622 12.7954 5.19343 12.9068 5.28995 13L9.12995 16.84C9.22291 16.9337 9.33351 17.0081 9.45537 17.0589C9.57723 17.1097 9.70794 17.1358 9.83995 17.1358C9.97196 17.1358 10.1027 17.1097 10.2245 17.0589C10.3464 17.0081 10.457 16.9337 10.55 16.84L18.7099 8.68C18.8115 8.58636 18.8925 8.4727 18.9479 8.3462C19.0033 8.21971 19.0319 8.0831 19.0319 7.945C19.0319 7.8069 19.0033 7.67029 18.9479 7.54379C18.8925 7.41729 18.8115 7.30364 18.7099 7.21Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
        </td>
      );
    });
    rows.push(
      <tr key={user.email} className="user-row">
        {[
          <th key={user} className="sticky inset-0 bg-white px-2">
            <div className="flex items-center">
              <div className="user-avatar">M</div>
              <div className="user-name">{user.name}</div>
            </div>
          </th>,
          ...userDates,
        ]}
      </tr>
    );
  } else {
    // Show the signup row
    rows.push(
      <tr key="Signup-row" className="user-row relative">
        <th className="sticky inset-0 bg-white px-2">
          <div className="flex items-center">
            <div className="user-avatar">M</div>
            <div className="user-name">Me</div>
          </div>
        </th>
        <td colspan="2">
          <div class="mr-1">
            <button
              data-target="modal-signup"
              onClick={() => setModalOpen(true)}
              className="icon-button sm inline"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 17.9999H9.24C9.37161 18.0007 9.50207 17.9755 9.62391 17.9257C9.74574 17.8759 9.85656 17.8026 9.95 17.7099L16.87 10.7799L19.71 7.99994C19.8037 7.90698 19.8781 7.79637 19.9289 7.67452C19.9797 7.55266 20.0058 7.42195 20.0058 7.28994C20.0058 7.15793 19.9797 7.02722 19.9289 6.90536C19.8781 6.7835 19.8037 6.6729 19.71 6.57994L15.47 2.28994C15.377 2.19621 15.2664 2.12182 15.1446 2.07105C15.0227 2.02028 14.892 1.99414 14.76 1.99414C14.628 1.99414 14.4973 2.02028 14.3754 2.07105C14.2536 2.12182 14.143 2.19621 14.05 2.28994L11.23 5.11994L4.29 12.0499C4.19732 12.1434 4.12399 12.2542 4.07423 12.376C4.02446 12.4979 3.99924 12.6283 4 12.7599V16.9999C4 17.2652 4.10536 17.5195 4.29289 17.707C4.48043 17.8946 4.73478 17.9999 5 17.9999ZM14.76 4.40994L17.59 7.23994L16.17 8.65994L13.34 5.82994L14.76 4.40994ZM6 13.1699L11.93 7.23994L14.76 10.0699L8.83 15.9999H6V13.1699ZM21 19.9999H3C2.73478 19.9999 2.48043 20.1053 2.29289 20.2928C2.10536 20.4804 2 20.7347 2 20.9999C2 21.2652 2.10536 21.5195 2.29289 21.707C2.48043 21.8946 2.73478 21.9999 3 21.9999H21C21.2652 21.9999 21.5196 21.8946 21.7071 21.707C21.8946 21.5195 22 21.2652 22 20.9999C22 20.7347 21.8946 20.4804 21.7071 20.2928C21.5196 20.1053 21.2652 19.9999 21 19.9999Z"
                  fill="currentColor"
                />
              </svg>
              Enter My Dates
            </button>
          </div>
        </td>
        <td colspan={dates.length - 3}>&nbsp;</td>
      </tr>
    );
  }
  return rows;
};

export default function Event() {
  const [modalOpen, setModalOpen] = useState(false);
  const e = useLoaderData();
  const [event, setEvent] = useState(e);
  const user = loadUser();

  const dates = [];
  const today = new Date();
  const daysToAdd = 45;
  for (let i = 0; i < daysToAdd; i++) {
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

  return (
    <>
      <div className="m-4 text-center">
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9352512270307393"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-9352512270307393"
          data-ad-slot="6502745854"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
      <section>
        <div className="mx-auto max-w-6xl px-2 md:px-4">
          <div className="card">
            <div className="w-full">
              <div className="flex flex-wrap items-start justify-between">
                <div className="w-full md:w-2/3">
                  <div className="title">
                    <h1>{event.title}</h1>
                  </div>
                  <div className="description">
                    <p>{event.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex w-full items-center md:mt-0 md:w-1/3 md:justify-end">
                  <button
                    className="icon-button"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      try {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: "Select your availability...",
                              text: event.title,
                              url: window.location.href,
                            })
                            .then(() => console.log("Successful share"))
                            .catch((error) =>
                              console.log("Error sharing", error)
                            );
                        }
                      } catch (err) {
                        console.error("Share failed:", err.message);
                      }
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 10.5H20V9.5C20 9.23478 19.8946 8.98043 19.7071 8.79289C19.5196 8.60536 19.2652 8.5 19 8.5C18.7348 8.5 18.4804 8.60536 18.2929 8.79289C18.1054 8.98043 18 9.23478 18 9.5V10.5H17C16.7348 10.5 16.4804 10.6054 16.2929 10.7929C16.1054 10.9804 16 11.2348 16 11.5C16 11.7652 16.1054 12.0196 16.2929 12.2071C16.4804 12.3946 16.7348 12.5 17 12.5H18V13.5C18 13.7652 18.1054 14.0196 18.2929 14.2071C18.4804 14.3946 18.7348 14.5 19 14.5C19.2652 14.5 19.5196 14.3946 19.7071 14.2071C19.8946 14.0196 20 13.7652 20 13.5V12.5H21C21.2652 12.5 21.5196 12.3946 21.7071 12.2071C21.8946 12.0196 22 11.7652 22 11.5C22 11.2348 21.8946 10.9804 21.7071 10.7929C21.5196 10.6054 21.2652 10.5 21 10.5ZM13.3 12.22C13.8336 11.7581 14.2616 11.1869 14.5549 10.545C14.8482 9.90316 15 9.20571 15 8.5C15 7.17392 14.4732 5.90215 13.5355 4.96447C12.5979 4.02678 11.3261 3.5 10 3.5C8.67392 3.5 7.40215 4.02678 6.46447 4.96447C5.52678 5.90215 5 7.17392 5 8.5C4.99999 9.20571 5.1518 9.90316 5.44513 10.545C5.73845 11.1869 6.16642 11.7581 6.7 12.22C5.30014 12.8539 4.11247 13.8775 3.27898 15.1685C2.4455 16.4596 2.00147 17.9633 2 19.5C2 19.7652 2.10536 20.0196 2.29289 20.2071C2.48043 20.3946 2.73478 20.5 3 20.5C3.26522 20.5 3.51957 20.3946 3.70711 20.2071C3.89464 20.0196 4 19.7652 4 19.5C4 17.9087 4.63214 16.3826 5.75736 15.2574C6.88258 14.1321 8.4087 13.5 10 13.5C11.5913 13.5 13.1174 14.1321 14.2426 15.2574C15.3679 16.3826 16 17.9087 16 19.5C16 19.7652 16.1054 20.0196 16.2929 20.2071C16.4804 20.3946 16.7348 20.5 17 20.5C17.2652 20.5 17.5196 20.3946 17.7071 20.2071C17.8946 20.0196 18 19.7652 18 19.5C17.9985 17.9633 17.5545 16.4596 16.721 15.1685C15.8875 13.8775 14.6999 12.8539 13.3 12.22ZM10 11.5C9.40666 11.5 8.82664 11.3241 8.33329 10.9944C7.83994 10.6648 7.45542 10.1962 7.22836 9.64805C7.0013 9.09987 6.94189 8.49667 7.05764 7.91473C7.1734 7.33279 7.45912 6.79824 7.87868 6.37868C8.29824 5.95912 8.83279 5.6734 9.41473 5.55764C9.99667 5.44189 10.5999 5.5013 11.1481 5.72836C11.6962 5.95542 12.1648 6.33994 12.4944 6.83329C12.8241 7.32664 13 7.90666 13 8.5C13 9.29565 12.6839 10.0587 12.1213 10.6213C11.5587 11.1839 10.7956 11.5 10 11.5Z"
                        fill="currentColor"
                      />
                    </svg>
                    Share Invite
                  </button>
                </div>
              </div>
              <div className="meta">
                <div className="meta-item">
                  <div className="user-avatar">M</div>
                  <div className="meta-text">
                    Matthew is the event organiser
                  </div>
                </div>
                <div className="meta-item">
                  <div className="meta-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 11H13V7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7V12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13H15C15.2652 13 15.5196 12.8946 15.7071 12.7071C15.8946 12.5196 16 12.2652 16 12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11ZM12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <div className="meta-text">2 hours</div>
                </div>
                <div className="meta-item">
                  <div className="meta-icon">
                    <svg
                      className="h-5 text-grey-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.4102 8.64C21.4102 8.64 21.4102 8.64 21.4102 8.59C20.7056 6.66623 19.4271 5.00529 17.7477 3.83187C16.0683 2.65845 14.0689 2.02917 12.0202 2.02917C9.97145 2.02917 7.97213 2.65845 6.29271 3.83187C4.61328 5.00529 3.3348 6.66623 2.6302 8.59C2.6302 8.59 2.6302 8.59 2.6302 8.64C1.84332 10.8109 1.84332 13.1891 2.6302 15.36C2.6302 15.36 2.6302 15.36 2.6302 15.41C3.3348 17.3338 4.61328 18.9947 6.29271 20.1681C7.97213 21.3416 9.97145 21.9708 12.0202 21.9708C14.0689 21.9708 16.0683 21.3416 17.7477 20.1681C19.4271 18.9947 20.7056 17.3338 21.4102 15.41C21.4102 15.41 21.4102 15.41 21.4102 15.36C22.1971 13.1891 22.1971 10.8109 21.4102 8.64ZM4.2602 14C3.91342 12.6892 3.91342 11.3108 4.2602 10H6.1202C5.96023 11.3285 5.96023 12.6715 6.1202 14H4.2602ZM5.0802 16H6.4802C6.71491 16.8918 7.05041 17.7541 7.4802 18.57C6.49949 17.9019 5.67969 17.0241 5.0802 16ZM6.4802 8H5.0802C5.67107 6.97909 6.48039 6.10147 7.4502 5.43C7.03075 6.24725 6.70534 7.10942 6.4802 8ZM11.0002 19.7C9.77196 18.7987 8.90934 17.4852 8.5702 16H11.0002V19.7ZM11.0002 14H8.1402C7.95359 12.6732 7.95359 11.3268 8.1402 10H11.0002V14ZM11.0002 8H8.5702C8.90934 6.51477 9.77196 5.20132 11.0002 4.3V8ZM18.9202 8H17.5202C17.2855 7.10816 16.95 6.24594 16.5202 5.43C17.5009 6.09807 18.3207 6.97594 18.9202 8ZM13.0002 4.3C14.2284 5.20132 15.091 6.51477 15.4302 8H13.0002V4.3ZM13.0002 19.7V16H15.4302C15.091 17.4852 14.2284 18.7987 13.0002 19.7ZM15.8602 14H13.0002V10H15.8602C16.0468 11.3268 16.0468 12.6732 15.8602 14ZM16.5502 18.57C16.98 17.7541 17.3155 16.8918 17.5502 16H18.9502C18.3507 17.0241 17.5309 17.9019 16.5502 18.57ZM19.7402 14H17.8802C17.9615 13.3365 18.0016 12.6685 18.0002 12C18.0013 11.3315 17.9612 10.6636 17.8802 10H19.7402C20.087 11.3108 20.087 12.6892 19.7402 14Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="meta-text">GMT - Greenwich Mean Time</div>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full md:mt-6">
              <div className="overflow-x-auto rounded-md border border-grey-100 bg-white pt-1">
                <table>
                  <thead>
                    <tr>{renderHeader(dates, event.dates)}</tr>
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
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="m-4 text-center">
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9352512270307393"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-9352512270307393"
          data-ad-slot="2608319607"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
      <dialog
        id="modal-signup"
        className={
          modalOpen
            ? "fixed inset-0 z-20 flex h-full w-full items-center overflow-y-auto bg-grey-800 bg-opacity-80 p-4"
            : "hidden"
        }
      >
        <Signup name="" email="" callback={() => setModalOpen(false)} />
      </dialog>
    </>
  );
}
