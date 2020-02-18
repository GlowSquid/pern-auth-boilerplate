import App from "next/app";
// import axios from "axios";
import nextCookie from "next-cookies";

App.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  const { token } = nextCookie(ctx);
  if (token) {
    console.log("token", { token });
  }

  return { pageProps };
};

export default App;
