import { useState } from "react";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import Cookies from "universal-cookie";
import TokenService from "../services/token.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const result = await fetch("http://localhost:3030/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const json = await result.json();

    const tokenService = new TokenService();
    tokenService.saveToken(json.authToken);
    // const cookies = new Cookies();
    // cookies.set("token", json.authToken, { path: "/" });

    Router.push("/secretpage");
  };

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => changeEmail(e)}
        ></input>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => changePassword(e)}
        ></input>
        <button onClick={(e) => onLogin(e)}>Submit</button>
      </form>
    </div>
  );
};

export default Login;
