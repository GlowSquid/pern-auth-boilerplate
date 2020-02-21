import Router from "next/router";
import nextCookie from "next-cookies";
import axios from "axios";
import cookie from "js-cookie";

export const login = ({ token }) => {
  cookie.set("token", token, { expires: 30 });
  Router.push("/profile");
};

export const auth = ctx => {
  const { token } = nextCookie(ctx);

  if (!token) {
    if (typeof window === "undefined") {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
    } else {
      Router.push("/");
    }
  }
  return token;
};

export const logout = () => {
  axios.get("http://localhost:5000/api/v1/auth/logout");
  cookie.remove("token");
  Router.push("/");
};

export const deleteAccount = async token => {
  console.log("token del", token);
  logout();
  await axios.delete("http://localhost:5000/api/v1/auth/delete", {
    headers: {
      authorization: `Bearer ${token}`,
      contentType: "application/json"
    }
  });
};

export const catchErrors = (error, showError) => {
  let err;
  if (error.response) {
    err = error.response.data.error;
    console.log("err response", err);
  } else if (error.request) {
    err = error.request;
    console.log("err request", err);
  } else {
    err = error.message;
    console.log("err message", err);
  }
  showError(err);
};

export default catchErrors;
