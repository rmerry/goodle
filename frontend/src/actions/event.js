import { API_URL } from "../constants";

export const getEvent = async (eventId) => {
  return await fetch(`${API_URL}/v1/event/${eventId}`)
    .then((response) => response.json())
    .then((data) => {
      const {event} = data;
      return event;
    }).catch((error) => {
      console.log('error', error);
    });
};

export const createEvent = async (event) => {
 const requestOptions = {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(event),
 };
 return fetch(`${API_URL}/v1/event`, requestOptions)
   .then((response) => response.json())
   .then((data) => {
     const {event} = data;
     return event;
   })
   .catch((error) => {
    console.log('error', error);
   });
}

export const addAttendee = async (data) => {
  const {date, email, name, hash} = data; // Only send what the server wants
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({date, email, name, hash}),
  };

  return fetch(`${API_URL}/v1/event/${data.hash}/attendee`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const { event } = data;
      return event;
    })
    .catch((error) => {
      console.log("error", error);
    });
}

export const removeAttendee = async (data) => {
  const {date, email} = data; // Only send what the server wants
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({date, email}),
  };

  return fetch(`${API_URL}/v1/event/${data.hash}/attendee`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const { event } = data;
      return event;
    })
    .catch((error) => {
      console.log("error", error);
    });
}
