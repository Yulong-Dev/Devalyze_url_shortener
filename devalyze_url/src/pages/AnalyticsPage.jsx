// src/pages/AnalyticsPage.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ✅ Match your other service files:
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://dvilz.onrender.com";

// ✅ Helper: Get token for authorization
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/analytics`, {
          method: "GET",
          headers: getAuthConfig(),
          credentials: "include",
        });

        const text = await res.text();
        console.log("Analytics raw response:", text);

        if (!res.ok) {
          let parsed;
          try {
            parsed = JSON.parse(text);
          } catch {
            parsed = text;
          }
          const msg =
            (parsed && parsed.message) ||
            (typeof parsed === "string" ? parsed : `Server responded ${res.status}`);
          throw new Error(msg);
        }

        let json;
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON returned from analytics endpoint");
        }

        if (!Array.isArray(json)) {
          throw new Error("Analytics endpoint did not return an array");
        }

        const normalized = json.map((item) => ({
          date: item.date ?? item._id ?? "",
          clicks: Number(item.clicks ?? 0),
          scans: Number(item.scans ?? 0),
        }));

        setData(normalized);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p className="text-center">Loading analytics...</p>;
  if (error)
    return <p className="text-center text-red-500">Analytics error: {error}</p>;

  // ✅ Compute totals
  const totalViews = data.reduce((sum, d) => sum + (d.scans || 0), 0);
  const totalClicks = data.reduce((sum, d) => sum + (d.clicks || 0), 0);
  const ctr = totalViews ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="bg-white flex flex-col border rounded-xl shadow-lg ">
        <h2 className="text-2xl font-bold border-b mb-5 p-4 sm:p-5 sm:mb-6 text-black">
          Analytics
        </h2>

        {/* ✅ Stats Cards Section */}
        <div className="grid grid-cols-3 self-center  sm:grid-cols-4 gap-2 sm:gap-20 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-sm">Scans</p>
            <h3 className="text-2xl font-bold text-blue-600">{totalViews}</h3>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-sm">Clicks</p>
            <h3 className="text-2xl font-bold text-orange-600">{totalClicks}</h3>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-sm">CTR</p>
            <h3 className="text-2xl font-bold text-green-600">{ctr}%</h3>
          </div>
        </div>

        {/* ✅ Chart Section */}
        {data.length === 0 ? (
          <p className="text-gray-500">No analytics available yet.</p>
        ) : (
          <div style={{ width: "100%", height: 420 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    typeof d === "string" && d.length >= 10 ? d.slice(5) : d
                  }
                  allowDuplicatedCategory={false}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
