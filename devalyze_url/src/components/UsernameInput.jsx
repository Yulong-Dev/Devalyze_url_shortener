import React, { useState, useEffect } from "react";
import { checkUsername } from "../services/pageService";
import { Check, X, Loader2 } from "lucide-react";

function UsernameInput({ value, onChange, onValidChange }) {
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // Reset state when value changes
        setAvailable(null);
        setError("");

        // Don't check if empty or too short
        if (!value || value.length < 3) {
            setError(value.length > 0 && value.length < 3 ? "Minimum 3 characters" : "");
            if (onValidChange) onValidChange(false);
            return;
        }

        // Validate format
        const usernameRegex = /^[a-z0-9_-]+$/;
        if (!usernameRegex.test(value)) {
            setError("Only lowercase letters, numbers, _ and - allowed");
            if (onValidChange) onValidChange(false);
            return;
        }

        // Debounce API call
        const timer = setTimeout(async () => {
            setChecking(true);
            try {
                const result = await checkUsername(value);
                setAvailable(result.available);
                setError(result.available ? "" : result.reason || "Username taken");
                if (onValidChange) onValidChange(result.available);
            } catch (err) {
                setError("Failed to check availability");
                if (onValidChange) onValidChange(false);
            } finally {
                setChecking(false);
            }
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timer);
    }, [value, onValidChange]);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Username</label>
            <div className="relative">
                <div className="flex items-center gap-2 border-2 rounded-md px-3 py-2 bg-white focus-within:border-blue-500 transition">
                    <span className="text-gray-500 font-medium">@</span>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value.toLowerCase())}
                        placeholder="yourusername"
                        className="flex-1 outline-none bg-transparent text-base sm:text-lg"
                        maxLength={30}
                    />

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                        {checking && <Loader2 className="animate-spin text-gray-400" size={20} />}
                        {!checking && available === true && <Check className="text-green-500" size={20} />}
                        {!checking && available === false && <X className="text-red-500" size={20} />}
                    </div>
                </div>
            </div>

            {/* Helper Text */}
            <div className="text-sm">
                {error && <p className="text-red-500">{error}</p>}
                {available && (
                    <p className="text-green-600 flex items-center gap-1">
                        <Check size={16} />
                        <span>Username available! Your link will be: <strong>yourapp.com/u/{value}</strong></span>
                    </p>
                )}
                {!value && (
                    <p className="text-gray-500">
                        Choose a unique username for your page URL
                    </p>
                )}
            </div>
        </div>
    );
}

export default UsernameInput;