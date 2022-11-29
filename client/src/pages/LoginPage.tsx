import React from "react";
import { useAuth } from "../store/useAuth";

function LoginPage() {
  const [input, setInput] = React.useState({ email: "", password: "" });
  const login = useAuth((state) => state.login);
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(input.email, input.password);
  };
  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          onChange={changeHandler}
          value={input.email}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={changeHandler}
          value={input.password}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
