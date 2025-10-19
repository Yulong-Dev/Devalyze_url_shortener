import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/smoothui/ui/ScrollToTop";
import { initializeCsrfToken } from "./utils/csrf"; // existing
import Home from "./pages/Home";
// ... import other pages

function App() {
    const [csrfReady, setCsrfReady] = useState(false);
    const [csrfError, setCsrfError] = useState(null);

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
                setCsrfReady(true);
            }
        };
        setupCsrf();
    }, []);

    if (!csrfReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Initializing secure connection...</p>
                    <p className="text-gray-400 text-sm mt-2">Setting up CSRF protection</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                {/* ... other routes */}
            </Routes>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            {csrfError && (
                <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg max-w-md">
                    <p className="text-sm font-medium">Security Warning</p>
                    <p className="text-xs mt-1">CSRF protection failed to initialize. Some features may not work properly.</p>
                </div>
            )}
        </Router>
    );
}

export default App;
