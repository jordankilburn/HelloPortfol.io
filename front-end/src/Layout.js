import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Topbar from "./Topbar";
import Aside from "./Aside";

import Dash from "./components/Dash";
import Manage from "./components/Manage";

import Footer from "./Footer";

function Layout({ functions }) {
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      <ToastContainer position="top-center" />
      <Aside toggled={toggled} handleToggleSidebar={handleToggleSidebar} />
      <main>
        <Topbar handleToggleSidebar={handleToggleSidebar} />
        <Routes>
          <Route path="/" element={<Dash functions={functions} />} />
          <Route path="manage" element={<Manage />} />
        </Routes>
        <Footer />
      </main>
    </div>
  );
}

export default Layout;
