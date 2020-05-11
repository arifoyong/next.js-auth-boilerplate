import Cookies from "universal-cookie";
import fetch from "isomorphic-unfetch";
import Router from "next/router";
import TokenService from "../services/token.service";

const tokenService = new TokenService();

const SecretPage = ({ data }) => {
  return (
    <div>
      <h1>This is a secret page</h1>
      <p>Welcome {data.user.name}</p>
      {console.log(data)}
    </div>
  );
};

SecretPage.getInitialProps = async (ctx) => {
  const data = await tokenService.authenticateSsr(ctx);

  return { data: data };
};

export default SecretPage;
