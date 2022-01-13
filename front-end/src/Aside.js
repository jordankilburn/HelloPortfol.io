import React from "react";
import { Link } from "react-router-dom";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import {
  FaTachometerAlt,
  FaGem,
  FaList,
  FaGithub,
  FaRegLaughWink,
  FaHeart,
} from "react-icons/fa";

const Aside = ({ toggled, handleToggleSidebar }) => {
  return (
    <ProSidebar
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Hi There
        </div>
      </SidebarHeader>
      <SidebarContent >
        <Menu iconShape="round" onClick={() => handleToggleSidebar(false)}>
          <MenuItem icon={<FaTachometerAlt />} >
            Dashboard
            <Link to="/" />
          </MenuItem>
          <MenuItem icon={<FaList />}>
            Manage
            <Link to="/manage" />
          </MenuItem>
        </Menu>
        {/* <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow">3</span>}
            title={"withSuffix"}
          >
            <MenuItem>{"submenu"} 1</MenuItem>
            <MenuItem>{"submenu"} 2</MenuItem>
            <MenuItem>{"submenu"} 3</MenuItem>
          </SubMenu>
          <SubMenu
            prefix={<span className="badge gray">3</span>}
            title={"withPrefix"}
          >
            <MenuItem>{"submenu"} 1</MenuItem>
            <MenuItem>{"submenu"} 2</MenuItem>
            <MenuItem>{"submenu"} 3</MenuItem>
          </SubMenu>
          <SubMenu title={"multiLevel"}>
            <MenuItem>{"submenu"} 1 </MenuItem>
            <MenuItem>{"submenu"} 2 </MenuItem>
            <SubMenu title={`${"submenu"})} 3`}>
              <MenuItem>{"submenu"} 3.1 </MenuItem>
              <MenuItem>{"submenu"} 3.2 </MenuItem>
              <SubMenu title={`${"submenu"})} 3.3`}>
                <MenuItem>{"submenu"} 3.3.1 </MenuItem>
                <MenuItem>{"submenu"} 3.3.2 </MenuItem>
                <MenuItem>{"submenu"} 3.3.3 </MenuItem>
              </SubMenu>
            </SubMenu>
          </SubMenu>
        </Menu> */}
      </SidebarContent>

      {/* <SidebarFooter style={{ textAlign: "center" }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: "20px 24px",
          }}
        >
          Footer
        </div>
      </SidebarFooter> */}
    </ProSidebar>
  );
};

export default Aside;
