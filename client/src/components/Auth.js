import React, { useState } from "react";
import axios from "axios";

import { login } from "../utils/auth";

const Auth = ({ user }) => {
  const [formData, setFormData] = useState({
    email: user.email || "",
    password: user.password || ""
  });

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
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formData,
        config
      );
      console.log(res.data);
      // console.log("res.data.token", res.data.token);

      if (res.status === 200) {
        const token = res.data.token;
        await login({ token });
      } else {
        console.log("fail");
      }
    } catch (err) {
      console.log(err);
      // catchErrors;
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="split">
        <div className="signup-form">Sign Up</div>
        <div className="login-form">Login</div>
      </div>
      <h1 className="form-title">Log in existing user</h1>
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

        <button className="btn btn-login" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

// Auth.getInitialProps = ctx => {};

export default Auth;
