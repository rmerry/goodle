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

export async function createEventAction({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // See if there is a user to create
  if (data.hasOwnProperty("name") && data.hasOwnProperty("email")) {
    const { name, email } = data;
    const user = { name, email, accountCreated: true };
    saveUser(user);
    delete data["name"];
    delete data["email"];
  }

  const user = loadUser();
  const { name, email } = user;
  // TODO Refactor this out perhaps to two actions at a later date.
  const event = { ...data, owner: { name, email } };
  const response = await createEvent(event);

  if (response !== undefined) {
    return redirect(`/event/${response.hash}`);
  } else {
    alert("Error creating event");
    return false;
  }
}

function App() {
  // Load any stored user
  const user = loadUser();

  const [errors, setErrors] = useState([]);
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [accountCreated] = useState(user.accountCreated);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const emptyTitle = title.length > 0 ? false : true;
  const emptyName = userName.length > 0 ? false : true;
  const emptyEmail = userEmail.length > 0 ? false : true;
  return (
    <>
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-sm">
            <div className="mb-6 text-center">
              <a className="mb-6 inline-block" href="#">
                <img
                  className="h-16"
                  src="https://shuffle.dev/flex-ui-assets/logos/flex-circle-blue.svg"
                  alt=""
                  data-config-id="auto-img-4-4"
                />
              </a>
              <h3
                className="mb-4 text-2xl font-bold md:text-3xl"
                data-config-id="auto-txt-1-4"
              >
                Goodle!
              </h3>
              <p
                className="text-lg font-medium text-grey-500"
                data-config-id="auto-txt-2-4"
              >
                Welcome {user.name}
              </p>
            </div>
            <Form
              method="post"
              onSubmit={(e) => {
                const formErrors = [];
                if (
                  !accountCreated &&
                  userName.length === 0 &&
                  userEmail.length === 0
                ) {
                  formErrors.push("Please enter your user details");
                }
                if (title.length < 1) {
                  formErrors.push("Please give your event a title");
                }

                if (formErrors.length > 0) {
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
                          return <li key={idx}>{e}</li>;
                        })}
                      </ul>
                    </div>
                  ) : null}
                  <div className="mb-6">
                    <label
                      className="mb-2 block font-medium text-grey-800"
                      for="name"
                    >
                      Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                      }}
                      placeholder="Your name"
                      aria-label="name"
                      aria-invalid={
                        emptyName ? null : userName.length > 0 ? false : true
                      }
                      className="w-full rounded-lg border border-grey-200 px-4 py-2.5 text-base font-normal text-grey-900 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="mb-2 block font-medium text-grey-800"
                      for="email"
                    >
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userEmail}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                      }}
                      placeholder="Email address"
                      aria-label="email"
                      aria-invalid={
                        emptyEmail
                          ? null
                          : validateEmail(userEmail)
                          ? false
                          : true
                      }
                      className="w-full rounded-lg border border-grey-200 px-4 py-2.5 text-base font-normal text-grey-900 outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              ) : null}
              <div className="mb-6">
                <label
                  className="mb-2 block font-medium text-grey-800"
                  name="title"
                  for="title"
                >
                  Event Title*
                </label>
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
                  className="w-full rounded-lg border border-grey-200 px-4 py-2.5 text-base font-normal text-grey-900 outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label
                  className="mb-2 block font-medium text-grey-800"
                  for="description"
                >
                  Event Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event Description"
                  aria-label="email"
                  className="block h-40 w-full resize-none rounded-lg border border-grey-200 p-4 text-base font-normal text-grey-900 outline-none focus:border-blue-500"
                  name="description"
                />
              </div>
              <button
                className="inline-block w-full rounded-md bg-blue-500 py-3 px-7 text-center text-base font-medium leading-6 text-blue-50 shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                type="submit"
              >
                Create Event
              </button>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
