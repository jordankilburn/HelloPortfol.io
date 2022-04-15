import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Topbar from "./components/Topbar";
import Aside from "./components/Aside";

import Dash from "./pages/Dash";
import Manage from "./pages/Manage";
// import RetirementCalc from "./pages/RetirementCalc"

import Footer from "./components/Footer";

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
          {/* <Route path="retirement-calculator" element={<RetirementCalc />} /> */}
        </Routes>
        {/* <Footer /> */}
        </div>
        
      </main>
    </div>
  );
}

export default Layout;
