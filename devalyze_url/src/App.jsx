import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/smoothui/ui/ScrollToTop";

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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
          <Route path="/services" element={<Services />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
            // <DashboardLayout />
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
    </Router>
  );
}

export default App;
