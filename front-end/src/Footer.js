import React from "react";

import { FaHeart } from "react-icons/fa";

export default () => {
  return (
    <footer>
      <small>
        © {new Date().getFullYear()} made with{" "}
        <FaHeart style={{ color: "red" }} /> by -{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://jordankilburn.com"
        >
          Jordan Kilburn
        </a>
      </small>
      <br />
    </footer>
  );
};
