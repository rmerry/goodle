import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import { createEvent } from "../actions/event";
import Signup from "../components/signup";
import { validateEmail } from "../helper/email";

const defaultUser = {
  name: "",
  email: "",
  accountCreated: false,
};

export const loadUser = () => {
  const user = localStorage.getItem("user");
  return user === null ? defaultUser : JSON.parse(user);
};

export async function  createEventAction({ request, params }) {
  const formData = await request.formData();
  const event = Object.fromEntries(formData);
  const response = await createEvent(event);
  if (response !== undefined) {
    return redirect(`/event/${response.hash}`);
  } else {
    alert("Error creating event");
    return false
  }
}

const renderCreateEvent = (title, description, setTitle, setDescription) => {
  const emptyTitle = title.length > 0 ? false : true;
  return (
    <section id="createEvent">
      <h2>Create an Event</h2>
      <Form method="post">
        <label className="block">
          <span className="text-gray-700">Name:</span>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name of the Event"
            aria-label="email"
            aria-invalid={emptyTitle ? null : title.length > 0 ? false : true}
            className="form-input"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description:</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event Description"
            aria-label="email"
            className="form-input"
            name="description"
          />
        </label>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Create Event
        </button>
      </Form>
    </section>
  );
}


function App() {
  // Load any stored user
  const user = loadUser();

  const [accountCreated, setAccountCreated] = useState(user.accountCreated);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  return (
    <>
      <header className="container">
        <hgroup>
          <h1>Goodle!</h1>
          <p>Welcome {user.name}</p>
        </hgroup>
      </header>  
      <main className="container">
      {!accountCreated ? <Signup name="" email="" callback={() => setAccountCreated(true)}/> : renderCreateEvent(title, description, setTitle, setDescription)}
      </main>
    </>
  );
}

export default App;
