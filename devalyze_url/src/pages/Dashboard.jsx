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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const linkRes = await fetch(`${API_BASE_URL}/my-urls`, {
          headers: getAuthHeaders(),
        });
        const linkData = await linkRes.json();
        setRecentLinks(Array.isArray(linkData) ? linkData.slice(0, 3) : []);

        const qrRes = await fetch(`${API_BASE_URL}/api/qr`, {
          headers: getAuthHeaders(),
        });
        const qrData = await qrRes.json();
        setRecentQrs(Array.isArray(qrData) ? qrData.slice(0, 3) : []);

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

        const pageRes = await fetch(`${API_BASE_URL}/api/pages/stats`, {
          headers: getAuthHeaders(),
        });
        const pageData = await pageRes.json();

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

  const COLORS = ["#2563eb", "#f97316"];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100">
      {/* Section 1: Recent Links + QR Codes */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6 w-full">
        {/* Recent Links */}
        <div className="bg-white w-full lg:w-[calc(50%-0.75rem)] p-4 sm:p-5 rounded-xl shadow-lg border">
          <h2 className="text-lg sm:text-xl font-bold text-black mb-3">
            Latest Links
          </h2>
          {recentLinks.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {recentLinks.map((link) => (
                <li
                  key={link._id}
                  className="border-t pt-3 pb-2 relative text-gray-700"
                >
                  <p className="text-sm text-gray-500 truncate pr-20">
                    <a
                      href={link.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black font-semibold text-sm sm:text-base hover:underline"
                    >
                      {link.longUrl.length > 60
                        ? link.longUrl.slice(0, 60) + "..."
                        : link.longUrl}
                    </a>
                  </p>

                  <p className="text-sm text-gray-600 truncate mt-1">
                    <a
                      href={`${API_BASE_URL}/${link.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 text-xs hover:underline"
                    >
                      {`${API_BASE_URL}/${link.shortCode}`}
                    </a>
                  </p>

                  <p className="text-xs flex gap-1 items-center absolute top-3 right-0 text-black">
                    <span className="bg-blue-100 rounded px-2 py-1 font-semibold text-gray-800">
                      {link.clicks || 0}
                    </span>
                    Clicks
                  </p>
                </li>
              ))}

              <div className="flex justify-center items-center gap-1 pt-3 text-gray-600 border-t mt-2">
                <Link to="links" className="hover:text-gray-800">
                  See all links
                </Link>
                <ArrowRight className="h-4 w-4" />
              </div>
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No recent links found.
            </p>
          )}
        </div>

        {/* Recent QR Codes */}
        <div className="bg-white w-full lg:w-[calc(50%-0.75rem)] p-4 sm:p-5 rounded-xl shadow-lg border">
          <h2 className="text-lg sm:text-xl font-bold text-black mb-3">
            Latest QR Codes
          </h2>
          {recentQrs.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentQrs.map((qr) => (
                <div
                  key={qr._id}
                  className="flex flex-row items-center justify-between border-t pt-3 pb-2 gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={qr.qrCodeUrl}
                      alt="QR Code"
                      className="w-12 h-12 flex-shrink-0 object-contain"
                    />
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <p className="text-sm text-black truncate">
                        {qr.longUrl}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        {new Date(qr.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-blue-600 flex-shrink-0">
                    {qr.scans || 0} Scans
                  </p>
                </div>
              ))}
              <div className="flex justify-center items-center gap-1 pt-3 text-gray-600 border-t mt-2">
                <Link to="qrcodes" className="hover:text-gray-800">
                  See all QR codes
                </Link>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No QR codes found.</p>
          )}
        </div>
      </div>

      {/* Section 2: Page Stats + Analytics */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Page Section */}
        <div className="bg-white w-full lg:w-[calc(50%-0.75rem)] p-4 sm:p-5 rounded-xl shadow-lg border">
          <h2 className="text-lg sm:text-xl font-bold text-black pb-3 mb-3 border-b">
            Your Page
          </h2>

          {pageStats ? (
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                <img
                  src={
                    pageStats.profileImage
                      ? pageStats.profileImage
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border flex-shrink-0"
                />

                <div className="flex-1 text-center sm:text-left w-full">
                  <h3 className="text-lg font-bold text-gray-900">
                    {pageStats.profileName || "Unnamed Page"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    @{pageStats.username}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {pageStats.bio || "No bio added yet."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="font-semibold text-gray-900">
                        {pageStats.totalViews}
                      </p>
                      <p className="text-gray-500">Views</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="font-semibold text-gray-900">
                        {pageStats.totalLinks}
                      </p>
                      <p className="text-gray-500">Links</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="font-semibold text-gray-900 text-[10px] sm:text-xs">
                        {new Date(pageStats.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </p>
                      <p className="text-gray-500">Created</p>
                    </div>
                  </div>

                  <a
                    href={`${FRONTEND_URL}/u/${pageStats.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
                  >
                    View Page
                  </a>
                </div>
              </div>
              <div className="flex justify-center items-center gap-1 pt-3 text-gray-600 border-t">
                <Link to="pages" className="hover:text-gray-800">
                  Manage Pages
                </Link>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-base sm:text-lg font-semibold mb-2">
                You haven't created a page yet.
              </p>
              <p className="text-sm mb-4">
                Go to the <span className="font-semibold">Pages</span> section
                to create one.
              </p>
              <Link
                to="pages"
                className="inline-block px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Page
              </Link>
            </div>
          )}
        </div>

        {/* Analytics Chart */}
        <div className="bg-white w-full lg:w-[calc(50%-0.75rem)] p-4 sm:p-5 rounded-xl shadow-lg border">
          <h2 className="text-lg sm:text-xl font-bold text-black pb-3 mb-3 border-b">
            Analytics Overview
          </h2>
          {analytics.length > 0 &&
          (analytics[0].value > 0 || analytics[1].value > 0) ? (
            <div className="w-full h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
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
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              <p className="text-base sm:text-lg font-semibold mb-2">
                No analytics data yet
              </p>
              <p className="text-sm">
                Start creating links and QR codes to see your stats here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
