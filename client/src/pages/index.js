import React from "react";

import MainLayout from "../components/_App/MainLayout";
import Auth from "../components/Auth";

const Index = () => {
  return (
    <MainLayout title="Home">
      <div className="frame overview">
        <Auth user={"user"} />
      </div>
    </MainLayout>
  );
};

// Index.getInitialProps = async () => {

// };

export default Index;
