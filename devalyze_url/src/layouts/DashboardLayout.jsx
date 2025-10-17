import React, { useState, useEffect, useRef } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  Link as RouterLink,
} from "react-router-dom";
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
} from "lucide-react";
import { toast } from "react-toastify";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const profileRef = useRef(null);
  const createRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://dvilz.onrender.com";

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("Please log in to access your dashboard");
        navigate("/SignIn");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        navigate("/SignIn");
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target))
        setOpenProfile(false);
      if (createRef.current && !createRef.current.contains(event.target))
        setOpenCreate(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Greeting
  const date = new Date();
  const hours = date.getHours();
  const greeting =
    hours < 12
      ? "Good Morning"
      : hours < 17
      ? "Good Afternoon"
      : "Good Evening";
  const icon = hours < 12 ? "☀️" : hours < 17 ? "🌞" : "🌙";
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast.success("Signed out successfully");
    navigate("/");
  };

  // Avatar
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
      "#607D8B",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash % colors.length)];
  };

  const UserAvatar = ({ fullName }) => {
    if (!fullName) return null;
    const parts = fullName.trim().split(" ");
    const initials =
      parts.length >= 2
        ? parts[1][0].toUpperCase() + parts[0][0].toUpperCase()
        : parts[0][0].toUpperCase();
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
        }}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-gray-50 shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 px-2`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <img src="/logos/devalyse.png" alt="logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Devalyze</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1 py-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2 text-sm rounded transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
              {link.badge && (
                <span className="ml-auto bg-blue-900 text-white text-xs px-2 rounded">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="border-t my-3" />
          {navLinks2.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2 text-sm rounded transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Topbar */}
        <header className="flex justify-between items-center gap-3 p-3 border-b bg-white sticky top-0 z-40">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 bg-gray-200 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Greeting */}
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <div>
              <h2 className="text-sm font-semibold">
                {greeting}, {user ? user.fullName : "Loading..."}
              </h2>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Create Button */}
            <div className="relative" ref={createRef}>
              <button
                onClick={() => setOpenCreate(!openCreate)}
                className="hidden sm:flex bg-blue-600 text-white px-4 py-2 rounded-lg items-center gap-2"
              >
                <Plus size={16} /> Create
              </button>

              {openCreate && (
                <div className="absolute top-12 right-0 w-56 bg-white rounded-lg shadow-lg p-2 z-50">
                  <ul className="p-2 space-y-1">
                    <li>
                      <RouterLink
                        to="/dashboard/links"
                        onClick={() => setOpenCreate(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Link size={17} /> Link
                        </div>
                        <span className="text-xs text-gray-400">⌘ + L</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink
                        to="/dashboard/qrcodes"
                        onClick={() => setOpenCreate(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <QrCode size={17} /> QR Code
                        </div>
                        <span className="text-xs text-gray-400">⌘ + G</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink
                        to="/dashboard/pages"
                        onClick={() => setOpenCreate(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <PanelTop size={17} /> Link Page
                        </div>
                        <span className="text-xs text-gray-400">⌘ + P</span>
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Search (desktop only) */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search links"
                className="border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <Search
                size={18}
                className="absolute left-2 top-2.5 text-gray-400"
              />
            </div>

            {/* Icons */}
            <Bell
              size={22}
              className="hidden sm:block text-gray-600 cursor-pointer"
            />
            <HelpCircle
              size={22}
              className="hidden sm:block text-gray-600 cursor-pointer"
            />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setOpenProfile(!openProfile)}>
                <UserAvatar fullName={user?.fullName || ""} />
              </button>

              {openProfile && (
                <div className="absolute top-12 right-0 w-56 bg-white rounded-xl shadow-lg p-3 z-50">
                  <div className="flex items-center gap-3 p-3 border-b bg-gray-50 rounded-t-xl">
                    <UserAvatar fullName={user?.fullName || "Guest"} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {user?.fullName || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || "guest@example.com"}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-2 text-sm">
                    <li>
                      <RouterLink
                        to="/dashboard/settings"
                        onClick={() => setOpenProfile(false)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <User size={16} /> My Profile
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink
                        to="/dashboard/settings"
                        onClick={() => setOpenProfile(false)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Settings size={16} /> Settings
                      </RouterLink>
                    </li>
                    <li
                      onClick={handleSignOut}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-red-500 cursor-pointer"
                    >
                      <LogOut size={16} /> Sign Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
