import React from "react";
import { Link } from "react-router-dom";

import { FaBars } from "react-icons/fa";

export default ({ handleToggleSidebar }) => {
  return (
    <header>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <div className="topbar">
        <span>
          Add/Remove assets in <Link to="/manage">Manage</Link> then select a date range
          in <Link to="/">Dashboard</Link>.
        </span>
      </div>
    </header>
  );
};
