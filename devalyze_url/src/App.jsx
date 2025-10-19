// devalyze_url/src/App.jsx
import React, { useEffect, useState } from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/smoothui/ui/ScrollToTop";
import { initializeCsrfToken } from "./utils/csrf"; // ✅ NEW

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import LinksPage from "./pages/Linkspage.jsx";
import QrPage from "./pages/QrPage.jsx";
import Pages from "./pages/Pages";
import PrivateRoute from "./components/PrivateRoute";
import Analytics from "./pages/AnalyticsPage.jsx";
import DomainPage from "./pages/Domain.jsx";
import Support from "./pages/Support.jsx";
import SettingsPage from "./pages/SettingsPage";
import PublicProfile from "./pages/PublicProfile.jsx";
import Services from "./pages/Services.jsx";
import About from "./pages/AboutUs.jsx";

function App() {
    // ✅ NEW: CSRF initialization state
    const [csrfReady, setCsrfReady] = useState(false);
    const [csrfError, setCsrfError] = useState(null);

    // ✅ NEW: Initialize CSRF protection on app mount
    useEffect(() => {
        const setupCsrf = async () => {
            try {
                console.log("🔒 Initializing CSRF protection...");
                await initializeCsrfToken();
                setCsrfReady(true);
                console.log("✅ CSRF protection initialized successfully");
            } catch (error) {
                console.error("❌ Failed to initialize CSRF protection:", error);
                setCsrfError(error.message);
                // Still set ready to true to allow app to load
                // Some features may not work without CSRF, but app shouldn't crash
                setCsrfReady(true);
            }
        };

        setupCsrf();
    }, []);

    // ✅ Loading screen while CSRF initializes
    if (!csrfReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">
                        Initializing secure connection...
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Setting up CSRF protection
                    </p>
                </div>
            </div>
        );
    }

    // ✅ Show warning if CSRF initialization failed (but still render app)
    if (csrfError) {
        console.warn("⚠️ App running without CSRF protection:", csrfError);
    }

    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="links" element={<LinksPage />} />
                    <Route path="qrcodes" element={<QrPage />} />
                    <Route path="pages" element={<Pages />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="domains" element={<DomainPage />} />
                    <Route path="support" element={<Support />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="/u/:username" element={<PublicProfile />} />
            </Routes>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            {/* ✅ Show CSRF warning banner if initialization failed */}
            {csrfError && (
                <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg max-w-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">
                                Security Warning
                            </p>
                            <p className="text-xs mt-1">
                                CSRF protection failed to initialize. Some features may not work properly.
                            </p>
                        </div>
                        <button
                            onClick={() => setCsrfError(null)}
                            className="ml-auto flex-shrink-0 text-yellow-700 hover:text-yellow-900"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </Router>
    );
}

export default App;