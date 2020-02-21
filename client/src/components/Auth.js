import React, { useState } from "react";
import axios from "axios";

import { login, catchErrors } from "../utils/actions";

const Auth = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = React.useState(false);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let endpoint;

      if (!showLogin) {
        endpoint = "register";
      } else {
        endpoint = "login";
      }
      setError(false);

      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const res = await axios.post(
        `http://localhost:5000/api/v1/auth/${endpoint}`,
        formData,
        config
      );
      // console.log(res.data);

      if (res.status === 200) {
        const token = res.data.token;
        await login({ token });
      } else {
        console.log("fail");
      }
    } catch (error) {
      // console.log("err.response.data.error", err.response.data.error);
      catchErrors(error, setError);
    } finally {
    }
  };

  return (
    <div className="container">
      <div className="split">
        <div
          onClick={() => setShowLogin(false)}
          className={showLogin ? "signup" : "signup signup-active"}
        >
          Sign Up
        </div>
        <div
          onClick={() => setShowLogin(true)}
          className={showLogin ? "login login-active" : "login"}
        >
          Login
        </div>
      </div>

      <h1 className="form-title">
        {showLogin ? "Log in existing user" : "Sign up for free"}
      </h1>

      <form className="form" onSubmit={e => handleSubmit(e)}>
        <input
          type="email"
          placeholder="E-mail"
          name="email"
          value={email}
          onChange={e => onChange(e)}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          // required
          value={password}
          onChange={e => onChange(e)}
        />

        {error ? <div className="error">{error}</div> : null}

        <input
          type="submit"
          className={showLogin ? "btn btn-login" : "btn btn-signup"}
          value={showLogin ? "Login" : "Register"}
        />
      </form>
    </div>
  );
};

// Auth.getInitialProps = ctx => {};

export default Auth;
