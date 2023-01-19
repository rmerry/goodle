import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import { createEvent } from "../actions/event";

const defaultUser = {
  name: "",
  email: "",
};

const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  return;
};

const loadUser = () => {
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
  return redirect(`/event/${response.Hash}`);
}


function App() {
  // Load any stored user
  const user = loadUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="container">
      <header className="">
        <h1>Goodle!</h1>
        <p>Welcome {user.name}</p>
      </header>
      <div>
        <form>
          <label className="block">
            <span className="text-gray-700">Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name, Nickname whatever"
              aria-label="name"
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email, so we can email or whatever"
              aria-label="email"
              className="form-input"
            />
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={(e) => {
              e.preventDefault();
              saveUser({ name, email });
            }}
          >
            Create User
          </button>
        </form>
      </div>
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
    </div>
  );
}

export default App;
