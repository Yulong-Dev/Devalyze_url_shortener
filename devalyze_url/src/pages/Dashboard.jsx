import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const FRONTEND_URL = import.meta.env.DEV
  ? "http://localhost:5173"
  : "https://devalyze.vercel.app";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://dvilz.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export default function Dashboard() {
  const [recentLinks, setRecentLinks] = useState([]);
  const [recentQrs, setRecentQrs] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageStats, setPageStats] = useState(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch recent links
        const linkRes = await fetch(`${API_BASE_URL}/my-urls`, {
          headers: getAuthHeaders(),
        });
        const linkData = await linkRes.json();
        setRecentLinks(Array.isArray(linkData) ? linkData.slice(0, 3) : []);

        // 2️⃣ Fetch recent QR codes
        const qrRes = await fetch(`${API_BASE_URL}/api/qr`, {
          headers: getAuthHeaders(),
        });
        const qrData = await qrRes.json();
        setRecentQrs(Array.isArray(qrData) ? qrData.slice(0, 3) : []);

        // 3️⃣ Fetch analytics
        const analyticsRes = await fetch(`${API_BASE_URL}/api/analytics`, {
          headers: getAuthHeaders(),
        });
        const analyticsData = await analyticsRes.json();

        let totalClicks = 0,
          totalScans = 0;
        analyticsData.forEach((a) => {
          totalClicks += a.clicks || 0;
          totalScans += a.scans || 0;
        });

        setAnalytics([
          { name: "Clicks", value: totalClicks },
          { name: "Scans", value: totalScans },
        ]);

        // 4️⃣ Fetch user's page stats
          // 4️⃣ Fetch user's page stats
          const pageRes = await fetch(`${API_BASE_URL}/api/pages/stats`, {
              headers: getAuthHeaders(),
          });
          const pageData = await pageRes.json();
          console.log("=== PAGE STATS API RESPONSE ===");
          console.log("Full response:", pageData);
          console.log("Has 'exists' field?", pageData.exists);
          console.log("Stats object:", pageData.stats);
          console.log("Profile Name:", pageData.stats?.profileName);
          console.log("Bio:", pageData.stats?.bio);
          console.log("Username:", pageData.stats?.username);
          console.log("================================");
// Debug: Check what the API returns
          console.log("Page data from API:", pageData);

          if (pageData.exists && pageData.stats) {
              setPageStats(pageData.stats);
          } else {
              setPageStats(null);
          }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const COLORS = ["#2563eb", "#f97316"]; // blue & orange

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* 🧭 Section 1: Recent Links + QR Codes */}
      <div className="flex-col sm:flex-row gap-6 mb-6 flex">
        {/* Recent Links */}
        <div className="bg-white w-full sm:w-[49%] h-2/5 p-4 rounded-xl shadow-lg border">
          <h2 className="text-xl font-bold text-black p-2  mb-2">
            Latest Links
          </h2>
          {recentLinks.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {recentLinks.map((link) => (
                <li
                  key={link._id}
                  className="border-t p-1 relative text-gray-700"
                >
                  {/* Long URL */}
                  <p className="text-sm text-gray-500 truncate">
                    <a
                      href={link.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black font-semibold text-md hover:underline"
                    >
                      {link.longUrl.length > 60
                        ? link.longUrl.slice(0, 60) + "..."
                        : link.longUrl}
                    </a>
                  </p>

                  {/* Short URL */}
                  <p className="text-sm text-gray-600 truncate">
                    <a
                      href={`${API_BASE_URL}/${link.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 text-xs hover:underline"
                    >
                      {`${API_BASE_URL}/${link.shortCode}`}
                    </a>
                  </p>

                  {/* Click Count */}
                  <p className="text-xs flex gap-1 items-center absolute top-2 right-2 text-black mt-1">
                    <span className="bg-blue-100 rounded p-1 font-semibold text-gray-800">
                      {link.clicks || 0}
                    </span>
                    Clicks
                  </p>
                </li>
              ))}

              <div className=" flex justify-center items-center gap-1 pt-2 text-gray-600 border-t w-full">
                <Link to="links">See all links</Link>
                <ArrowRight className="h-4 w-4" />
              </div>
            </ul>
          ) : (
            <p className="text-gray-500">No recent links found.</p>
          )}
        </div>

        {/* Recent QR Codes */}
        <div className="bg-white w-full sm:w-[49%] h-2/5 p-4 rounded-xl shadow-lg relative border">
          <h2 className="text-xl font-bold text-black p-3 ">Latest QR Codes</h2>
          {recentQrs.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentQrs.map((qr) => (
                <div
                  key={qr._id}
                  className="flex items-center border-t p-1 relative text-center"
                >
                  <img
                    src={qr.qrCodeUrl}
                    alt="QR Code"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex flex-col ml-3 gap-1 text-left">
                    <p className="text-sm text-black mt-1">{qr.longUrl}</p>
                    {/* Date Created */}
                    <p className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Calendar size={12} />{" "}
                      {new Date(qr.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Scan Count */}
                  <p className="text-sm font-medium absolute top-3 right-2 text-blue-600">
                    {qr.scans || 0} Scans
                  </p>
                </div>
              ))}
              <div className=" flex justify-center object-bottom items-center gap-1 pt-2 text-gray-600 border-t w-full">
                <Link to="qrcodes">See all Qrcodes</Link>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No QR codes found.</p>
          )}
        </div>
      </div>

      {/* 🧭 Section 2: Pages Summary + Analytics Pie Chart */}
      <div className="flex-col sm:flex-row gap-6 mb-2 flex">
        {/* Pages Created (Visual Preview) */}

        <div className="bg-white w-full sm:w-[49%] h-2/5 p-4 rounded-xl shadow-lg border">
          <h2 className="text-xl font-bold text-black pb-3 border-b ">
            Your Page
          </h2>

          {pageStats ? (
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-2">
                {/* Profile Image */}
                <img
                  src={
                    pageStats.profileImage
                      ? pageStats.profileImage
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border"
                />

                {/* Page Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {pageStats.profileName || "Unnamed Page"}
                  </h3>
                  <p className="text-sm text-gray-500">@{pageStats.username}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {pageStats.bio || "No bio added yet."}
                  </p>

                  {/* Stats */}
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>👁 {pageStats.totalViews} Views</p>
                    <p>🔗 {pageStats.totalLinks} Links</p>
                    <p>
                      🗓 Created:{" "}
                      {new Date(pageStats.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* View Page Button */}
                  <a
                    href={`${FRONTEND_URL}/u/${pageStats.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    View Page
                  </a>
                </div>
              </div>
              <div className=" flex justify-center items-center gap-1 pt-2 text-gray-600 border-t w-full">
                <Link to="pages">See Pages</Link>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              <p className="text-lg font-semibold mb-2">
                You haven’t created a page yet.
              </p>
              <p className="text-sm">
                Go to the <span className="font-semibold">Pages</span> section
                to create one.
              </p>
            </div>
          )}
        </div>

        {/* Analytics Pie Chart */}
        <div className="bg-white w-full sm:w-[49%] h-2/5 p-4 rounded-xl shadow-lg border">
          <h2 className="text-xl font-bold border-b p-2 text-black mb-4">
            Analytics Overview
          </h2>
          {analytics.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {analytics.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500">No analytics data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
