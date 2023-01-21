import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import { createEvent } from "../actions/event";
import { validateEmail } from "../helper/email";

const defaultUser = {
  name: "",
  email: "",
  accountCreated: false,
};

export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  return;
};

export const loadUser = () => {
  const user = localStorage.getItem("user");
  return user === null ? defaultUser : JSON.parse(user);
};

export async function  createEventAction({ request, params }) {
  console.log('pressed');
  const formData = await request.formData();
  const event = Object.fromEntries(formData);
  console.log('formData', formData);
  console.log('event', event);
  const response = await createEvent(event);
  console.log('response', response)
  if (response !== undefined) {
    return redirect(`/event/${response.hash}`);
  } else {
    alert("Error creating event");
    return false
  }
}

const renderSignup = (name, email, setName, setEmail, saveUser, setAccountCreated) => {
  console.log('name.length :>> ', name.length);
  const emptyName = name.length > 0 ? false : true;
  const emptyEmail = email.length > 0 ? false : true;
  return (
    <div>
      <h2>Your Details</h2>
      <form>
          <label className="block">
            <span className="text-gray-700">Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Name, Nickname whatever"
              aria-label="name"
              aria-invalid={emptyName ? null : name.length > 0 ? false : true}
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email, so we can email even updates or whatever"
              aria-label="email"
              aria-invalid={emptyEmail ? null :validateEmail(email) ? false : true}
              className="form-input"
            />
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={(e) => {
              e.preventDefault();
              saveUser({ name, email, accountCreated: true });
              setAccountCreated(true);
            }}
          >
            Save
          </button>
        </form>
      </div>
  )
}

const renderCreateEvent = (title, description, setTitle, setDescription) => {
  const emptyTitle = title.length > 0 ? false : true;
  return (
    <div>
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
    </div>
  );
}


function App() {
  // Load any stored user
  const user = loadUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [accountCreated, setAccountCreated] = useState(user.accountCreated);
  
  console.log('user :>> ', user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  console.log('title :>> ', title);
  console.log('name.length :>> ', name.length);
  return (
    <div className="container">
      <header className="">
        <h1>Goodle!</h1>
        <p>Welcome {user.name}</p>
      </header>  
      {!accountCreated ? renderSignup(name, email, setName, setEmail, saveUser, setAccountCreated) : renderCreateEvent(title, description, setTitle, setDescription)}
    </div>
  );
}

export default App;
