import React from "react";
import axios from "axios";
import nextCookie from "next-cookies";
import { logout } from "../utils/auth";

import MainLayout from "../components/_App/MainLayout";

const Profile = ({ user, token }) => {
  return (
    <MainLayout title="Profile">
      {(user && (
        <div className="container">
          <h2 className="form-title">Authenticated</h2>
          {/* <div>Everything: {JSON.stringify(user)}</div> */}
          <div>Email: {user.email}</div>
          <div>ID: {user.id}</div>
          <div>Role: {user.role}</div>
          <div>Created at: {user.created}</div>
          <div>Token: {token}</div>
          <button className="btn btn-login" onClick={logout}>
            Log out
          </button>
          <button className="btn btn-delete">Delete Account</button>
        </div>
      )) ||
        "Please sign in"}
    </MainLayout>
  );
};

Profile.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx);
  if (token) {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          authorization: `Bearer ${token}`,
          contentType: "application/json"
        }
        // credentials: "include"
      });
      const user = await res.data.data;
      return {
        user,
        token
      };
    } catch (err) {
      console.log("ERR:", err);
    }
  }
};

export default Profile;
