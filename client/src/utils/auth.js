import Router from "next/router";
import nextCookie from "next-cookies";
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
