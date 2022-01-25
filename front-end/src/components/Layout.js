import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Topbar from "./Topbar";
import Aside from "./Aside";

import Dash from "../pages/Dash";
import Manage from "../pages/Manage";

import Footer from "./Footer";

function Layout({ functions }) {
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      <ToastContainer limit={2} position="top-center" />
      <Aside toggled={toggled} handleToggleSidebar={handleToggleSidebar} />
      <main>
        <Topbar handleToggleSidebar={handleToggleSidebar} />
        <div className="content">

        <Routes>
          <Route path="/" element={<Dash functions={functions} />} />
          <Route path="manage" element={<Manage />} />
        </Routes>
        {/* <Footer /> */}
        </div>
        
      </main>
    </div>
  );
}

export default Layout;
