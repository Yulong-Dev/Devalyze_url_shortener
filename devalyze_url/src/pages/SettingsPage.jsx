// src/views/dashboard/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://dvilz.onrender.com/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ✅ Full language + country arrays
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese (Mandarin)",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "Italian",
  "Dutch",
  "Turkish",
  "Swahili",
  "Hausa",
  "Igbo",
  "Yoruba",
  "Zulu",
  "Other",
];

const COUNTRIES = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "South Africa",
  "Kenya",
  "Ghana",
  "China",
  "Japan",
  "India",
  "Brazil",
  "Mexico",
  "Turkey",
  "Russia",
  "Australia",
  "Other",
];

const SettingsPage = () => {
  const [fullName, setFullName] = useState("");
  const [surname, setSurname] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, getAuthConfig());
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setFullName(data.fullName || "");
        setSurname(data.surname || "");
        setOtherNames(data.otherNames || "");
        setLanguage(data.language || "");
        setCountry(data.country || "");
        setEmail(data.email || "");
      } catch (err) {
        toast.error("Failed to load user settings");
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: getAuthConfig().headers,
        body: JSON.stringify({
          fullName,
          surname,
          otherNames,
          language,
          country,
          // ❌ email intentionally not sent
        }),
      });
      if (!res.ok) throw new Error("Profile update failed");
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Error updating profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: "PATCH",
        headers: getAuthConfig().headers,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error("Password update failed");
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error("Error changing password");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Surname */}
        <div>
          <label className="block text-sm font-medium mb-2">Surname</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Other Names */}
        <div>
          <label className="block text-sm font-medium mb-2">Other Names</label>
          <input
            type="text"
            value={otherNames}
            onChange={(e) => setOtherNames(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Language & Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select a language</option>
              {LANGUAGES.map((lang, idx) => (
                <option key={idx} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email (disabled) */}
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Email cannot be changed for security reasons
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Change Password */}
      <h3 className="text-xl font-semibold mt-10 mb-4">Change Password</h3>
      <form
        onSubmit={handleChangePassword}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
