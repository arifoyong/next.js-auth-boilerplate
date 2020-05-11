import Cookies from "universal-cookie";
import fetch from "isomorphic-unfetch";
import Router from "next/router";

export default class TokenService {
  saveToken(token) {
    const cookies = new Cookies();
    cookies.set("token", token, { path: "/" });

    console.log("inside token.service");
    return Promise.resolve();
  }

  async authenticateSsr(ctx) {
    const cookies = new Cookies(ctx.req ? ctx.req.headers.cookie : null);
    const token = cookies.get("token");

    const response = await fetch("http://localhost:3030/api/validate", {
      body: JSON.stringify({ token: token }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      method: "POST",
    });

    console.log("inside");
    const data = await response.json();

    if (!data.success) {
      const res = ctx.res;

      if (res) {
        res.writeHead(302, { Location: "/login" });
        res.end();
      } else {
        Router.push("/login");
      }
    }

    return data.data;
  }
}
