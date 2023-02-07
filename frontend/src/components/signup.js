import { useState } from "react";
import { validateEmail } from "../helper/email";
import { saveUser } from "../actions/user";

const Signup = ({ name, email, accountCreated, callback }) => {
  const [userName, setUserName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [userAccountCreated, setUserAccountCreated] = useState(accountCreated);

  console.log("name.length :>> ", name.length);
  const emptyName = userName.length > 0 ? false : true;
  const emptyEmail = userEmail.length > 0 ? false : true;

  return (
    <div class="m-auto w-full max-w-lg rounded-md bg-white p-8">
      <div class="mb-6 text-center">
        <h3 class="mb-4 text-2xl font-bold md:text-3xl">Join our community</h3>
        <p class="text-lg font-medium text-grey-500">
          It's going to be Gooood-le.
        </p>
      </div>
      <form action="">
        <div class="mb-6">
          <label class="mb-2 block font-medium text-grey-800" for="">
            Name*
          </label>
          <input
            type="name"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="Name, Nickname whatever"
            aria-label="name"
            aria-invalid={emptyName ? null : userName.length > 0 ? false : true}
            class="block w-full appearance-none rounded-lg border border-grey-200 p-3 leading-5 text-grey-900 placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-6">
          <label class="mb-2 block font-medium text-grey-800" for="">
            Email*
          </label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
            placeholder="Email, so we can email even updates or whatever"
            aria-label="email"
            aria-invalid={
              emptyEmail ? null : validateEmail(userEmail) ? false : true
            }
            class="block w-full appearance-none rounded-lg border border-grey-200 p-3 leading-5 text-grey-900 placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div class="-m-2 flex flex-wrap justify-end">
          <div class="w-full p-2 md:w-1/2">
            <a
              href="#close"
              aria-label="Close"
              className="close"
              data-target="modal-example"
              onClick={() => callback()}
              class="flex w-full flex-wrap justify-center rounded-md border border-grey-200 bg-white px-4 py-2.5 text-base font-medium text-grey-500 hover:border-grey-300 hover:text-grey-600"
            >
              Cancel
            </a>
          </div>
          <div class="w-full p-2 md:w-1/2">
            <button
              onClick={(e) => {
                e.preventDefault();
                saveUser({
                  name: userName,
                  email: userEmail,
                  accountCreated: true,
                });
                setUserAccountCreated(true);
                callback();
              }}
              class="flex w-full flex-wrap justify-center rounded-md border border-blue-500 bg-blue-500 px-4 py-2.5 text-base font-medium text-white hover:bg-blue-600"
            >
              Get Started
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
