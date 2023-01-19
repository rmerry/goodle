import {useState} from "react"

const storeUser = (name, email) => {
    localStorage.setItem("name", JSON.stringify(name));
    localStorage.setItem("email", JSON.stringify(email));
    return
}

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form>
      <label className="block">
        <span className="text-gray-700">Email:</span>
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
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email, so we can email or whatever"
          aria-label="email"
          className="form-input"
        />
      </label>
      <input type="submit" value="Submit" onClick={() => storeUser()} />
    </form>
  );
}

export default Signup;