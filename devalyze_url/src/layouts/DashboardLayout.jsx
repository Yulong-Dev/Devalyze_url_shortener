import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Menu,
  PanelTop,
  TrendingUp,
  QrCode,
  Link,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Globe,
  X,
  ArrowRight,
} from "lucide-react";

const navLinks = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  { name: "Links", icon: <Link size={18} />, path: "/dashboard/links" },
  { name: "QR Codes", icon: <QrCode size={18} />, path: "/dashboard/qr" },
  { name: "Pages", icon: <PanelTop size={18} />, path: "/dashboard/pages" },
  {
    name: "Analytics",
    icon: <TrendingUp size={18} />,
    path: "/dashboard/analytics",
  },
  {
    name: "Domains",
    icon: <Globe size={18} />,
    path: "/dashboard/domains",
    badge: "Upgrade",
  },
];
const navLinks2 = [
  {
    name: "Support",
    icon: <HelpCircle size={18} />,
    path: "/dashboard/support",
  },
  {
    name: "Settings",
    icon: <Settings size={18} />,
    path: "/dashboard/settings",
  },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // closed by default on mobile

  // Time & Greeting
  const date = new Date();
  const hours = date.getHours();
  let greeting = "";
  let icon = "";

  if (hours < 12) {
    greeting = "Good Morning";
    icon = "☀️";
  } else if (hours < 17) {
    greeting = "Good Afternoon";
    icon = "🌞";
  } else {
    greeting = "Good Evening";
    icon = "🌙";
  }

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <div
        className={`flex flex-col bg-gray-50 text-black justify-between shadow-2xl w-64  py-7 h-full fixed md:static z-50 transform transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <nav className="flex flex-col items-start w-full gap-9">
          <div className="flex justify-between w-full px-4">
            <div className="flex text-center  gap-2 items-center">
              <img
                src="/logos/devalyse.png"
                alt="devalyze_logo"
                className="h-[41px] w-[50px]"
              />
              <h1 className=" text-2xl font-bold">Devalyze</h1>
            </div>
            {/* Close button (mobile only) */}
            <div className="flex justify-end items-center mb md:hidden">
              <button onClick={() => setSidebarOpen(false)}>
                <X size={22} />
              </button>
            </div>
          </div>
          <div className="flex flex-col ">
            {navLinks.map((link) => (
              <NavLink
                to={link.path}
                end={link.path === "/dashboard"}
                key={link.name}
                onClick={() => setSidebarOpen(false)} // close sidebar when clicked
                className={({ isActive }) =>
                  `flex items-center gap-3 text-sm px-7 py-2 rounded transition-all ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold shadow-inner"
                      : "text-gray-800 hover:bg-gray-100"
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-8 bg-blue-900 text-white text-xs px-2 rounded">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
            <div className="w-full flex flex-col border-t gap-2 border-b px-6 border-gray-200 mt-6">
              {navLinks2.map((link) => (
                <NavLink
                  to={link.path}
                  end={link.path === "/dashboard"}
                  key={link.name}
                  onClick={() => setSidebarOpen(false)} // close sidebar when clicked
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-sm py-2 rounded transition-all ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold shadow-inner"
                        : "text-gray-800 hover:bg-gray-100"
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-auto bg-yellow-500 text-black text-xs px-2 rounded">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Usage Progress */}
        <div className="flex flex-col gap-1.5 text-sm self-center w-4/5 h-auto rounded-lg p-2 bg-gray-200">
          <p className="flex items-center justify-between text-black">
            2/10 Links Used <X className="text-gray-300" size={15} />
          </p>
          <p className="text-[10px] text-gray-400 ">
            Enjoying Shortener? Consider upgrading your plan so you can go
            limitless.
          </p>
          <div className="bg-gray-300 h-1 rounded-full w-full mt-1">
            <div className="bg-blue-900 h-1 rounded-full w-4/5"></div>
          </div>
          <p className="flex text-blue-950 items-center gap-1 text-xs">
            Upgrade now
            <ArrowRight size={15} />{" "}
          </p>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 bg-gray-50 py-3 pr-3">
        {/* Topbar */}
        <div className="flex md:justify-between gap-8 items-center pb-3 px-3 w-full">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 bg-gray-200 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="greeting-container flex gap-2 ">
            {icon}
            <div className="flex flex-col text-start ">
              <h2 className="text-md font-bold">{greeting}, JniduBen</h2>
              <p className="text-gray-500 text-xs ">{formattedDate}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
              + Create New
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="border px-2 py-1 rounded text-sm"
            />
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Render section */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
