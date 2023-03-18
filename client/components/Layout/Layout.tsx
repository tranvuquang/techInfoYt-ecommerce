import React, { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
// import { Toaster } from "react-hot-toast";

type Props = {
  children: ReactNode;
  title: string;
  description: string;
  keywords: string;
  author: string;
};

const Layout = ({ children, title, description, keywords, author }: Props) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main
        style={{
          minHeight: 725,
          border: "1px solid black",
          transform: "translateY(75px)",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce app - shop now",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
  author: "Techinfoyt",
};

export default Layout;
