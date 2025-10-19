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

import { api, handleResponse } from "../utils/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AnalyticsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await api.get("/api/analytics", {
                    headers: getAuthHeaders(),
                });

                const json = await handleResponse(response);

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
            <div className="bg-white flex flex-col border rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold border-b mb-5 p-4 sm:p-5 sm:mb-6 text-black">
                    Analytics
                </h2>

                {/* ✅ Stats Cards Section */}
                <div className="flex justify-center p-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-2 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Scans</p>
                        <h3 className="text-lg sm:text-2xl font-semibold text-blue-600">
                            {totalViews}
                        </h3>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Clicks</p>
                        <h3 className="text-lg sm:text-2xl font-semibold text-orange-600">
                            {totalClicks}
                        </h3>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm">CTR</p>
                        <h3 className="text-lg sm:text-2xl font-semibold text-green-600">
                            {ctr}%
                        </h3>
                    </div>
                </div>

                {/* ✅ Chart Section */}
                {data.length === 0 ? (
                    <p className="text-gray-500 p-2">No analytics available yet.</p>
                ) : (
                    <div style={{ width: "99%", height: 420 }}>
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
};

export default AnalyticsPage;
