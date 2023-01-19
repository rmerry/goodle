import { API_URL } from "../constants";

export const getEvent = async (eventId) => {
  console.log('eventId', eventId);
  return await fetch(`${API_URL}/v1/event/${eventId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const {event} = data;
      console.log('event 0', event);
      return event;
    }).catch((error) => {
      console.log('error', error);
    });
};

export const createEvent = async (event)=> {
 console.log("event posting", event);
 const requestOptions = {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(event),
 };
 return fetch(`${API_URL}/v1/event`, requestOptions)
   .then((response) => response.json())
   .then((data) => {
     console.log("data", data);
     const {event} = data;
     return event;
     // this.setState({ postId: data.id });
   })
   .catch((error) => {
    console.log('error', error);
   });
}
