import React from "react";
import Link from "next/link";

import { FaBars } from "react-icons/fa";

type Props = {
  handleToggleSidebar: (value: boolean) => void;
};

export default ({ handleToggleSidebar }: Props) => {
  return (
    <header>
      <div className='btn-toggle' onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <div className='topbar'>
        <span>
          Add/Remove assets in <Link href='/manage'><a>Manage</a></Link> then select a
          date range in <Link href='/'><a>Dashboard</a></Link>.
        </span>
      </div>
    </header>
  );
};
