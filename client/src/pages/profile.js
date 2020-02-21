import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, logout, deleteAccount } from "../utils/actions";

import MainLayout from "../components/_App/MainLayout";

const Profile = ({ token }) => {
  const [user, setUser] = useState("Loading");
  const [loading, setLoading] = useState(true);
  // console.log(user);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          authorization: `Bearer ${token}`,
          contentType: "application/json"
        }
      });
      setUser(res.data.data);
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <MainLayout title="Profile">
      {(!loading && user && (
        <div className="container">
          <h2 className="form-title">Authenticated</h2>
          {/* <div>Everything: {JSON.stringify(user)}</div> */}
          <div>
            <strong>Email: </strong>
            {user.email}
          </div>
          <div>
            <strong>ID: </strong>
            {user.id}
          </div>
          <div>
            <strong>Role: </strong>
            {user.role}
          </div>
          <div>
            <strong>Created at: </strong>
            {user.created}
          </div>
          <div>
            <strong>Token: </strong>
            {token}
          </div>
          <button className="btn btn-login" onClick={logout}>
            Log out
          </button>
          <button
            className="btn btn-delete"
            onClick={() => deleteAccount(token)}
          >
            Delete Account
          </button>
        </div>
      )) || <div className="container">Loading..</div>}
    </MainLayout>
  );
};

Profile.getInitialProps = async ctx => {
  const token = auth(ctx);
  if (token) {
    return {
      token
    };
  } else {
    console.log("no token found");
  }
};

export default Profile;
