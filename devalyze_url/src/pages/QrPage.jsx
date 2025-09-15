import { useState, useEffect } from "react";
import { createQr, getMyQrs, deleteQr } from "../services/qrService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function QrPage() {
  const [url, setUrl] = useState("");
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch QR codes on mount
  useEffect(() => {
    loadQrs();
  }, []);

  const loadQrs = async () => {
    try {
      const data = await getMyQrs();
      setQrs(data);
    } catch (error) {
      console.error("Failed to fetch QRs:", error);
      toast.error("⚠️ Failed to load QR codes. Please try again.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.warning("Please enter a URL");
      return;
    }
    setLoading(true);
    try {
      await createQr({ longUrl: url });
      setUrl("");
      toast.success("🎉 QR Code created successfully");
      await loadQrs();
    } catch (error) {
      console.error("QR create failed:", error);
      toast.error("❌ Failed to create QR Code");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQr(id);
      toast.success("🗑️ QR Code deleted");
      await loadQrs();
    } catch (error) {
      console.error("QR delete failed:", error);
      toast.error("❌ Failed to delete QR Code");
    }
  };

  const handleCopyImage = async (qrCodeUrl) => {
    try {
      const res = await fetch(qrCodeUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.info("📋 QR code copied to clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("❌ Failed to copy QR code");
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
        toast.info("ℹ️ Sharing not supported in this browser");
      }
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("❌ Failed to share QR code");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="url"
          placeholder="Enter a URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {/* QR Codes List */}
      <div>
        {qrs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <img
              src="/empty-state.svg"
              alt="No QR Codes"
              className="w-32 h-32 mb-4 opacity-70"
            />
            <p className="text-lg font-medium">No QR Codes created yet</p>
            <p className="text-sm text-gray-400">
              Start by creating your first QR Code!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qrs.map((qr) => (
              <div
                key={qr._id}
                className="border rounded-lg p-4 flex flex-col items-center shadow-sm"
              >
                <img
                  src={qr.qrCodeUrl}
                  alt="QR Code"
                  className="w-40 h-40 mb-4"
                />
                <p className="text-sm text-gray-600 break-all mb-3">
                  {qr.longUrl}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyImage(qr.qrCodeUrl)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleShareImage(qr.qrCodeUrl)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleDelete(qr._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Scans: {qr.scans || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
