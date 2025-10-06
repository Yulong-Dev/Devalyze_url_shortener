import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  User,
  LogOut,
  Plus,
  Bell,
  Search,
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
  { name: "QR Codes", icon: <QrCode size={18} />, path: "/dashboard/qrcodes" },
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
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const profileRef = useRef(null);
  const createRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
      if (createRef.current && !createRef.current.contains(event.target)) {
        setOpenCreate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper: Generate random color (consistent per user)
  const getRandomColor = (name) => {
    const colors = [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#607D8B",
    ];

    // Pick color based on name hash (so it's stable for each user)
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const API_BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000" // Local backend
      : "https://dvilz.onrender.com"; // Render backend

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

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

  // Avatar component
  const UserAvatar = ({ fullName }) => {
    if (!fullName) return null;

    const parts = fullName.trim().split(" ");

    let initials = "";
    if (parts.length >= 2) {
      const surname = parts[0]; // always first word (surname)
      const firstName = parts[1]; // always second word (first name)
      initials = firstName[0].toUpperCase() + surname[0].toUpperCase();
    } else {
      initials = parts[0][0].toUpperCase(); // fallback if only one name
    }

    const bgColor = getRandomColor(fullName);

    return (
      <div
        style={{
          backgroundColor: bgColor,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="flex h-auto relative ">
      {/* Sidebar */}
      <div
        className={`flex flex-col bg-gray-50 text-black justify-between shadow-2xl w-64  py-7 min-h-screen fixed md:static z-50 transform transition-transform duration-300
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
            <div className=" flex flex-col border-t gap-2 border-b border-gray-200 mt-6">
              {navLinks2.map((link) => (
                <NavLink
                  to={link.path}
                  end={link.path === "/dashboard"}
                  key={link.name}
                  onClick={() => setSidebarOpen(false)} // close sidebar when clicked
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 text-sm py-2 rounded transition-all ${
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
      <div className="flex-1 bg-white pt-3 pr-1">
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
              <h2 className="text-[13px] md:text-md font-bold">
                {greeting}, {user ? user.fullName : "Loading..."}
              </h2>
              <p className="text-gray-500 text-[10px] md:text-xs ">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:flex " ref={createRef}>
              <button
                onClick={() => setOpenCreate(!openCreate)}
                className="bg-blue-600 text-white px-5 py-2 cursor-pointer rounded-lg flex items-center gap-2 font-semibold shadow-lg"
              >
                <Plus/> Create new
              </button>

              {openCreate && (
                <div className="absolute top-12 w-60 bg-white rounded-xl shadow-lg z-50">
                  <ul className="p-2 space-y-1">
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <Link size={17} /> Link
                      </span>
                      <span className="text-xs text-gray-400">⌘ + L</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <QrCode size={17} /> QR Code
                      </span>
                      <span className="text-xs text-gray-400">⌘ + G</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <PanelTop size={17} /> Link Page
                      </span>
                      <span className="text-xs text-gray-400">⌘ + P</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* For large/normal screens */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search links"
                className="outline-[#4E61F6] border border-gray-300 pl-8 px-4 py-2 rounded-md text-md"
              />
              <Search
                size={20}
                className="absolute left-2 top-3 text-gray-400"
              />
            </div>

            {/* For small screens */}
            <div className="flex md:hidden items-center">
              <Search size={24} className="text-gray-600 cursor-pointer" />
            </div>

            <Bell size={25} className="hidden md:flex" />
            <HelpCircle size={25} className="hidden md:flex" />

            <div className="relative " ref={profileRef}>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="w-10 h-10 cursor-pointer rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white"
              >
                <UserAvatar fullName={user?.fullName || "Guest User"} />
              </button>

              {openProfile && (
                <div className="absolute top-0 right-0  w-auto bg-white rounded-2xl shadow-lg p-4 z-50">
                  <div className="flex items-center gap-7 border-b pb-3">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white">
                      <UserAvatar fullName={user?.fullName || "Guest User"} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm flex w-auto">
                        {user ? user.fullName : "Loading..."}
                      </p>
                    </div>
                    </div>
                    <button className="ml-auto bg-blue-900 text-white px-3 py-1 rounded-lg text-xs">
                      Upgrade
                    </button>
                  </div>

                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <User /> My profile
                    </li>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <Bell /> Notifications
                    </li>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <Settings /> Settings
                    </li>
                    <hr className="border-t-1 border-gray-300"/>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100    cursor-pointer text-red-500">
                      <LogOut /> Sign out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Render section */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
