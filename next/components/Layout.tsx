import React, { useState, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Topbar from "./Topbar";
import Aside from "./Aside";
import Head from "next/head";
import Meta from "./Meta";

// import Footer from "./components/Footer";

type Props = {
  children?: ReactNode;
  title?: string;
};

function Layout({ children }: Props) {
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value: boolean) => {
    setToggled(value);
  };

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      <Meta />
      <ToastContainer limit={2} position="top-center" />
      <Aside toggled={toggled} handleToggleSidebar={handleToggleSidebar} />
      <main>
        <Topbar handleToggleSidebar={handleToggleSidebar} />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
