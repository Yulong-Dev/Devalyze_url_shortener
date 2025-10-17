import { useState, useEffect } from "react";
import { createQr, getMyQrs, deleteQr } from "../services/qrService";
import { toast } from "react-toastify";
import { Copy, Share2, Calendar, Trash2, Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function QrPage() {
  const [url, setUrl] = useState("");
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxLength, setMaxLength] = useState(window.innerWidth < 640 ? 25 : 60);

  useEffect(() => {
    loadQrs();

    // Responsive truncation setup
    const handleResize = () => {
      setMaxLength(window.innerWidth < 640 ? 25 : 60);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        toast.error(data?.message || "Failed to load QR codes");
      }
    } catch {
      toast.error("⚠️ Failed to load QR codes");
    } finally {
      setLoading(false);
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
    <div className="bg-gray-100 flex flex-col min-h-screen p-6 gap-6">
      {/* Create QR Section */}
      <div className="bg-white flex flex-col border rounded-md shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="url"
            placeholder="Enter a URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
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
                {/* QR Image */}
                <img
                  src={qr.qrCodeUrl}
                  alt="QR Code"
                  className="w-20 h-20 pt-2 sm:pt-0 rounded border"
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
    </div>
  );
}
