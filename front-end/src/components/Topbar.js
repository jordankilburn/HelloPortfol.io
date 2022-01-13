import React from "react";

import { FaBars } from "react-icons/fa";

export default ({ handleToggleSidebar }) => {
  return (
    <header>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
    </header>
  );
};
