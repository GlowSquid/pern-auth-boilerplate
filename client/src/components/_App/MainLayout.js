import Head from "next/head";
import HeadContent from "./HeadContent";
import Footer from "../Footer";

import "../../styles/mainStyle.css";

const MainLayout = ({ children, title, user }) => (
  <>
    <Head>
      <HeadContent />
      <link
        href="https://fonts.googleapis.com/css?family=Oxygen+Mono|Titillium+Web&display=swap"
        rel="stylesheet"
      />
      <title>{title}</title>
    </Head>
    <div>{children}</div>
    <Footer />
  </>
);

// MainLayout.getInitialProps = async ctx => {

// };

export default MainLayout;
