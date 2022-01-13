import * as React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <>
      <div className="row">
        <div className="item">
          {" "}
          <h2>Manage Page</h2>
          <p>You can do this, I believe in you.</p>
          <nav>
            <Link to="/">Dashboard</Link>
          </nav>
        </div>
      </div>
    </>
  );
};
