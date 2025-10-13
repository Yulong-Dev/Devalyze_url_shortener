import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicPage } from "../services/pageService";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Loader2, AlertCircle } from "lucide-react";

function PublicProfile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const themes = {
        custom: {
            titleColor: "#000",
            bioColor: "#444",
            backgroundColor: "#fff",
            linkBackgroundColor: "#f3f4f6",
            linkBorderColor: "#e5e7eb",
            linkTextColor: "#000",
            border: "2px dashed #4e61f6",
        },
        lakeWhite: {
            titleColor: "#222",
            bioColor: "#333",
            backgroundColor: "rgba(255,255,255,0.8)",
            linkBackgroundColor: "rgba(255,255,255,0.9)",
            linkBorderColor: "#e0e0e0",
            linkTextColor: "#222",
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            backdropFilter: "blur(20px)",
        },
        lakeBlack: {
            titleColor: "#fff",
            bioColor: "#ddd",
            backgroundColor: "rgba(20,20,20,0.8)",
            linkBackgroundColor: "rgba(40,40,40,0.8)",
            linkBorderColor: "#444",
            linkTextColor: "#fff",
            border: "1px solid #333",
            boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            backdropFilter: "blur(25px)",
        },
        airSmoke: {
            titleColor: "#f8f8f8",
            bioColor: "#d0d0d0",
            backgroundColor: "#1c1c1c",
            linkBackgroundColor: "#2a2a2a",
            linkBorderColor: "#3a3a3a",
            linkTextColor: "#f8f8f8",
            border: "1px solid #2a2a2a",
        },
        airSnow: {
            titleColor: "#1b1b1b",
            bioColor: "#333",
            backgroundColor: "#f8f9fa",
            linkBackgroundColor: "#fff",
            linkBorderColor: "#ddd",
            linkTextColor: "#1b1b1b",
            border: "1px solid #ddd",
        },
        airGrey: {
            titleColor: "#1a1a1a",
            bioColor: "#2e2e2e",
            backgroundColor: "#e5e7eb",
            linkBackgroundColor: "#f3f4f6",
            linkBorderColor: "#d1d5db",
            linkTextColor: "#1a1a1a",
            border: "1px solid #9ca3af",
        },
    };

    useEffect(() => {
        const fetchPage = async () => {
            console.log(`🌐 Fetching public page: u/${username}`);
            setLoading(true);
            setError(null);

            try {
                const data = await getPublicPage(username);
                console.log("✅ Page loaded:", data);
                setPage(data);
            } catch (err) {
                console.error("❌ Error loading page:", err);
                setError(err.message || "Page not found");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchPage();
        }
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-gray-600 text-sm sm:text-base">Loading page...</p>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center border border-gray-100">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Page Not Found
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                        The page <strong>@{username}</strong> doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-blue-600 text-white px-6 py-2.5 sm:py-3 rounded-full hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const currentTheme = themes[page.theme] || themes.lakeWhite;

    return (
        <div
            className="min-h-screen w-full px-4 sm:px-6 py-8 sm:py-12"
            style={{ backgroundColor: "#f3f4f6" }}
        >
            <div className="max-w-md mx-auto">
                <div
                    className="rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8"
                    style={{
                        backgroundColor: currentTheme.backgroundColor,
                        border: currentTheme.border,
                        boxShadow: currentTheme.boxShadow,
                        backdropFilter: currentTheme.backdropFilter,
                    }}
                >
                    <div className="flex flex-col gap-4 sm:gap-6 items-center text-center">
                        {/* Profile Image */}
                        {page.profileImage && (
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 overflow-hidden shadow-lg flex-shrink-0"
                                 style={{ borderColor: currentTheme.linkBorderColor }}
                            >
                                <img
                                    src={page.profileImage}
                                    alt={page.profileName}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        )}

                        {/* Name */}
                        {page.profileName && (
                            <h1
                                className="text-2xl sm:text-3xl font-bold break-words px-2"
                                style={{ color: currentTheme.titleColor }}
                            >
                                {page.profileName}
                            </h1>
                        )}

                        {/* Bio */}
                        {page.bio && (
                            <p
                                className="text-sm sm:text-base break-words px-2 max-w-sm"
                                style={{ color: currentTheme.bioColor }}
                            >
                                {page.bio}
                            </p>
                        )}

                        {/* Social Icons (First 4 Links Only) */}
                        {page.links && page.links.length > 0 && (
                            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center py-2 w-full">
                                {page.links.slice(0, 4).map((link, index) => (
                                    <a
                                        key={`icon-${index}`}
                                        href={link.LinkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 sm:p-3 rounded-lg hover:scale-110 transition-transform duration-200 shadow-md"
                                        style={{
                                            backgroundColor: currentTheme.linkBackgroundColor,
                                            border: `1px solid ${currentTheme.linkBorderColor}`,
                                        }}
                                        title={link.LinkTitle}
                                    >
                                        {link.socialIcon ? (
                                            <img
                                                src={link.socialIcon}
                                                alt={link.LinkTitle}
                                                className="w-6 h-6 sm:w-8 sm:h-8 rounded"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded flex items-center justify-center text-xs">
                                                🔗
                                            </div>
                                        )}
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Divider */}
                        {page.links && page.links.length > 0 && (
                            <div className="w-full pt-2">
                                <p
                                    className="text-xs font-semibold tracking-wider uppercase opacity-60"
                                    style={{ color: currentTheme.bioColor }}
                                >
                                    Featured Links
                                </p>
                            </div>
                        )}

                        {/* Full Link Cards */}
                        <div className="flex flex-col gap-2 sm:gap-3 w-full">
                            {page.links && page.links.length > 0 ? (
                                page.links.map((link, index) => (
                                    <a
                                        key={`full-${index}`}
                                        href={link.LinkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 rounded-full hover:scale-105 transition-all duration-200 group shadow-md"
                                        style={{
                                            backgroundColor: currentTheme.linkBackgroundColor,
                                            border: `2px solid ${currentTheme.linkBorderColor}`,
                                            color: currentTheme.linkTextColor,
                                        }}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                            {link.socialIcon ? (
                                                <img
                                                    src={link.socialIcon}
                                                    alt="icon"
                                                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 rounded"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 bg-gray-300 rounded flex items-center justify-center text-xs">
                                                    🔗
                                                </div>
                                            )}
                                            <span className="text-sm sm:text-base font-semibold truncate">
                                                {link.LinkTitle}
                                            </span>
                                        </div>
                                        <ArrowForwardIcon
                                            className="flex-shrink-0 group-hover:translate-x-1 transition-transform"
                                            fontSize="small"
                                        />
                                    </a>
                                ))
                            ) : (
                                <p className="text-gray-400 text-xs sm:text-sm py-4">
                                    No links added yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t w-full" style={{ borderColor: currentTheme.linkBorderColor }}>
                        <a
                            href="/"
                            className="text-xs sm:text-sm opacity-60 hover:opacity-100 transition inline-block"
                            style={{ color: currentTheme.bioColor }}
                        >
                            Made with ❤️ by Devalyze
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublicProfile;