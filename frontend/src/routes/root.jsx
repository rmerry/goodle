import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import { createEvent } from "../actions/event";
import { saveUser } from "../actions/user";
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
  const data = Object.fromEntries(formData);

  // See if there is a user to create
  if (data.hasOwnProperty('name') && data.hasOwnProperty('email')){
    const {name, email} = data;
    const user = { name, email, accountCreated: true };
    saveUser(user);
    delete data['name'];
    delete data['email'];
  }
  // TODO Refactor this out perhaps to two actions at a later date.
  const event = {...data};
  const response = await createEvent(event);

  if (response !== undefined) {
    return redirect(`/event/${response.hash}`);
  } else {
    alert("Error creating event");
    return false
  }
}

function App() {
  // Load any stored user
  const user = loadUser();

  const [errors, setErrors] = useState([]);
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [accountCreated, ] = useState(user.accountCreated);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const emptyTitle = title.length > 0 ? false : true;
  const emptyName = userName.length > 0 ? false : true;
  const emptyEmail = userEmail.length > 0 ? false : true;
  return (
    <>
      <header className="container">
        <hgroup>
          <h1>Goodle!</h1>
          <p>Welcome {user.name}</p>
        </hgroup>
      </header>
      <main className="container">
        <section id="createEvent">
          <h2>Create an Event</h2>
          <Form
            method="post"
            onSubmit={(e) => {
              const formErrors = [];
              if (
                (!accountCreated &&
                userName.length === 0 &&
                userEmail.length === 0)
              ) {
                formErrors.push("Please enter your user details");
              }
              if (title.length < 1) {
                formErrors.push("Please give your event a title");
              }

              if (formErrors.length > 0){
                setErrors(formErrors);
                e.preventDefault();
                return false;
              } 
              return true;
            }}
          >
            {!accountCreated ? (
              <>
                {errors.length > 0 ? (
                  <div>
                    <h3>Unable to continue...</h3>
                    <ul>
                      {errors.map((e, idx) => {
                        return (
                          <li key={idx}>{e}</li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
                <label className="block">
                  <span className="text-gray-700">Name:</span>
                  <input
                    type="text"
                    name="name"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                    placeholder="Your name, nickname whatever"
                    aria-label="name"
                    aria-invalid={
                      emptyName ? null : userName.length > 0 ? false : true
                    }
                    className="form-input"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Email:</span>
                  <input
                    type="email"
                    name="email"
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                    }}
                    placeholder="Email, so we can email even updates or whatever"
                    aria-label="email"
                    aria-invalid={
                      emptyEmail
                        ? null
                        : validateEmail(userEmail)
                        ? false
                        : true
                    }
                    className="form-input"
                  />
                </label>
              </>
            ) : null}
            <label className="block">
              <span className="text-gray-700">Event Title:</span>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name of the Event"
                aria-label="email"
                aria-invalid={
                  emptyTitle ? null : title.length > 0 ? false : true
                }
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
      </main>
    </>
  );
}

export default App;
