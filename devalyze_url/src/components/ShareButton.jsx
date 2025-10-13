import React, { useState } from "react";
import { Copy, Share2, Check, QrCode } from "lucide-react";
import { toast } from "react-toastify";

function ShareButton({ username, url }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("🔗 Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out my Devalyze page!`,
                    text: `Visit my page @${username}`,
                    url: url,
                });
                toast.success("Thanks for sharing!");
            } catch (err) {
                // User cancelled share
                console.log("Share cancelled");
            }
        } else {
            // Fallback to copy
            handleCopy();
        }
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-700">
                        Your Public Page
                    </p>
                    <p className="text-xs text-gray-500">Share this link anywhere!</p>
                </div>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                />
                <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2 font-medium"
                    title="Copy link"
                >
                    {copied ? (
                        <>
                            <Check size={16} />
                            <span className="hidden sm:inline">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            <span className="hidden sm:inline">Copy</span>
                        </>
                    )}
                </button>
                <button
                    onClick={handleShare}
                    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition flex items-center gap-2 font-medium"
                    title="Share link"
                >
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Share</span>
                </button>
            </div>

            <div className="flex gap-2 text-xs text-gray-600">
                <span>💡 Tip:</span>
                <span>Add this link to your Instagram, Twitter, or email signature!</span>
            </div>
        </div>
    );
}

export default ShareButton;