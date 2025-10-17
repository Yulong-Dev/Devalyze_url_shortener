import { useState, useEffect } from "react";
import { createQr, getMyQrs, deleteQr } from "../services/qrService";
import { Copy, Share2, Calendar, Trash2, Loader2, X, AlertCircle, CheckCircle, Info } from "lucide-react";

// Toast notification component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <div className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-64`}>
            {icons[type]}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="hover:opacity-80">
                <X size={18} />
            </button>
        </div>
    );
};

export default function QrPage() {
    const [url, setUrl] = useState("");
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxLength, setMaxLength] = useState(window.innerWidth < 640 ? 25 : 60);
    const [selectedQr, setSelectedQr] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [toastCounter, setToastCounter] = useState(0);

    useEffect(() => {
        loadQrs();

        const handleResize = () => {
            setMaxLength(window.innerWidth < 640 ? 25 : 60);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const showToast = (message, type = 'info') => {
        setToastCounter(prev => prev + 1);
        const id = `${Date.now()}-${toastCounter}`;
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const truncateUrl = (url) => {
        if (!url) return "";
        return url.length > maxLength ? url.slice(0, maxLength) + "..." : url;
    };

    const loadQrs = async () => {
        try {
            setLoading(true);
            const data = await getMyQrs();
            if (Array.isArray(data)) {
                setQrs(data);
            } else {
                showToast(data?.message || "Failed to load QR codes", 'error');
            }
        } catch {
            showToast("⚠️ Failed to load QR codes", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!url) {
            showToast("Please enter a URL", 'warning');
            return;
        }
        setLoading(true);
        try {
            await createQr({ longUrl: url });
            setUrl("");
            showToast("🎉 QR Code created successfully", 'success');
            await loadQrs();
        } catch (error) {
            console.error("QR create failed:", error);
            showToast("❌ Failed to create QR Code", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteQr(id);
            showToast("🗑️ QR Code deleted", 'success');
            await loadQrs();
        } catch (error) {
            console.error("QR delete failed:", error);
            showToast("❌ Failed to delete QR Code", 'error');
        }
    };

    const handleCopyImage = async (qrCodeUrl) => {
        try {
            const res = await fetch(qrCodeUrl);
            const blob = await res.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob }),
            ]);
            showToast("📋 QR code copied to clipboard", 'info');
        } catch (err) {
            console.error("Copy failed:", err);
            showToast("❌ Failed to copy QR code", 'error');
        }
    };

    const handleShareImage = async (qrCodeUrl) => {
        try {
            const res = await fetch(qrCodeUrl);
            const blob = await res.blob();
            const file = new File([blob], "qrcode.png", { type: blob.type });

            if (navigator.share) {
                await navigator.share({
                    files: [file],
                    title: "My QR Code",
                    text: "Scan this QR code",
                });
            } else {
                showToast("ℹ️ Sharing not supported in this browser", 'info');
            }
        } catch (err) {
            console.error("Share failed:", err);
            showToast("❌ Failed to share QR code", 'error');
        }
    };

    const openModal = (qr) => {
        setSelectedQr(qr);
    };

    const closeModal = () => {
        setSelectedQr(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCreate();
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col min-h-screen p-6 gap-6">
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            {/* Create QR Section */}
            <div className="bg-white flex flex-col border rounded-md shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                        type="url"
                        placeholder="Enter a URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                    />
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Generating..." : "Generate"}
                    </button>
                </div>
            </div>

            {/* QR Codes List */}
            <div className="bg-white border rounded-md shadow-lg">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                    <h2 className="font-bold text-lg">Devalyze QR Codes</h2>
                    <span className="text-md text-gray-500">{qrs.length} Total</span>
                </div>

                {loading ? (
                    <div className="p-6 flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Loading QR codes…</span>
                    </div>
                ) : qrs.length === 0 ? (
                    <div className="p-6 text-gray-500">
                        No QR codes yet. Create your first one above.
                    </div>
                ) : (
                    <div className="flex flex-col p-4 gap-1">
                        {qrs.map((qr) => (
                            <div
                                key={qr._id}
                                className="flex items-center gap-1 p-3 border rounded-md hover:bg-gray-50 transition relative"
                            >
                                {/* QR Image - Now clickable */}
                                <img
                                    src={qr.qrCodeUrl}
                                    alt="QR Code"
                                    onClick={() => openModal(qr)}
                                    className="w-20 h-20 pt-2 sm:pt-0 rounded border cursor-pointer hover:opacity-80 transition"
                                />

                                {/* Info */}
                                <div className="flex flex-col flex-1 pt-6 sm:pt-0">
                                    <p
                                        className="text-xs sm:text-sm text-gray-700 "
                                        title={qr.longUrl}
                                    >
                                        {truncateUrl(qr.longUrl)}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Scans: {qr.scans || 0}
                                    </p>
                                    <span className="text-gray-600 text-xs flex items-center gap-1">
                    <Calendar size={13} />{" "}
                                        {new Date(qr.createdAt).toLocaleDateString()}
                  </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 absolute top-3 right-3">
                                    <button
                                        onClick={() => handleCopyImage(qr.qrCodeUrl)}
                                        className="p-1.5 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleShareImage(qr.qrCodeUrl)}
                                        className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        <Share2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(qr._id)}
                                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Code Modal */}
            {selectedQr && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X size={24} />
                        </button>

                        {/* Modal content */}
                        <div className="flex flex-col items-center gap-4">
                            <h3 className="text-xl font-bold text-center">Scan QR Code</h3>

                            {/* Large QR Code */}
                            <img
                                src={selectedQr.qrCodeUrl}
                                alt="QR Code"
                                className="w-80 h-80 border-4 border-gray-200 rounded-lg"
                            />

                            {/* URL */}
                            <p className="text-sm text-gray-600 text-center break-all px-2">
                                {selectedQr.longUrl}
                            </p>

                            {/* Stats */}
                            <div className="flex gap-4 text-sm text-gray-500">
                                <span>Scans: {selectedQr.scans || 0}</span>
                                <span>
                  Created: {new Date(selectedQr.createdAt).toLocaleDateString()}
                </span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={() => handleCopyImage(selectedQr.qrCodeUrl)}
                                    className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center justify-center gap-2"
                                >
                                    <Copy size={18} />
                                    Copy
                                </button>
                                <button
                                    onClick={() => handleShareImage(selectedQr.qrCodeUrl)}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center gap-2"
                                >
                                    <Share2 size={18} />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}