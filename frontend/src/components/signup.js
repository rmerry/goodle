import {useState} from 'react';
import { validateEmail } from "../helper/email";
import { saveUser } from "../actions/user";

const Signup = ({
  name,
  email,
  accountCreated,
  callback
}) => {
    const [userName, setUserName] = useState(name);
    const [userEmail, setUserEmail] = useState(email);
    const [userAccountCreated, setUserAccountCreated] = useState(accountCreated);

    console.log("name.length :>> ", name.length);
    const emptyName = userName.length > 0 ? false : true;
    const emptyEmail = userEmail.length > 0 ? false : true;

    return (
      <section id="yourDetails">
        <h2>Your Details</h2>
        <form>
          <label className="block">
            <span className="text-gray-700">Name:</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              placeholder="Name, Nickname whatever"
              aria-label="name"
              aria-invalid={emptyName ? null : userName.length > 0 ? false : true}
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email:</span>
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
              className="form-input"
            />
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={(e) => {
              e.preventDefault();
              saveUser({ name: userName, email: userEmail, accountCreated: true });
              setUserAccountCreated(true);
              callback();
            }}
          >
            Continue
          </button>
        </form>
      </section>
    );
};


export default Signup;