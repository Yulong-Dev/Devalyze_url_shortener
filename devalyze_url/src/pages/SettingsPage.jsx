import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api, handleResponse } from "../utils/api"; // ✅ fixed relative path

const LANGUAGES = ["English", "Spanish", "French", "German", "Yoruba", "Hausa"];
const COUNTRIES = ["Nigeria", "United States", "Canada", "United Kingdom", "Ghana"];

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

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

    // ✅ Fetch user profile
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/users/me", {
                    headers: getAuthHeaders(),
                });
                const data = await handleResponse(response);

                setFullName(data.fullName || "");
                setSurname(data.surname || "");
                setOtherNames(data.otherNames || "");
                setLanguage(data.language || "");
                setCountry(data.country || "");
                setEmail(data.email || "");
            } catch (err) {
                toast.error("Failed to load user settings");
                console.error("⚠️ Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    // ✅ Save profile
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.patch(
                "/users/me",
                { fullName, surname, otherNames, language, country },
                { headers: getAuthHeaders() }
            );

            await handleResponse(response);
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err.message || "Error updating profile");
            console.error("⚠️ Error saving profile:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Change password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            toast.error("Please fill in both password fields");
            return;
        }

        try {
            const response = await api.patch(
                "/users/me/password",
                { currentPassword, newPassword },
                { headers: getAuthHeaders() }
            );

            await handleResponse(response);
            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            toast.error(err.message || "Error changing password");
            console.error("⚠️ Password change error:", err);
        }
    };

    return (
        <div className="bg-gray-100 p-6 min-h-screen">
            <div className="bg-white rounded-lg shadow">
                <div className="content-center border-b border-gray-100 h-12 px-6">
                    <h2 className="text-2xl font-semibold">Settings</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-gray-100 border rounded-lg px-4 py-2"
                            />
                        </div>

                        {/* Surname */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Surname</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                className="w-full border bg-gray-100 rounded-lg px-4 py-2"
                            />
                        </div>

                        {/* Other Names */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Other Names</label>
                            <input
                                type="text"
                                value={otherNames}
                                onChange={(e) => setOtherNames(e.target.value)}
                                className="w-full border bg-gray-100 rounded-lg px-4 py-2"
                            />
                        </div>

                        {/* Language & Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full border bg-gray-100 rounded-lg px-4 py-2"
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
                                    className="w-full border bg-gray-100 rounded-lg px-4 py-2"
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
                            <p className="text-xs text-red-500 mt-1">
                                ⚠️ Email cannot be changed for security reasons
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
                                className="w-full border bg-gray-100 rounded-lg px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border bg-gray-100 rounded-lg px-4 py-2"
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
            </div>
        </div>
    );
};

export default SettingsPage;
