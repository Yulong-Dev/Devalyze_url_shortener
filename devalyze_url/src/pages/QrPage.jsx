import { useState, useEffect } from "react";
import { createQr, getMyQrs, deleteQr } from "../services/qrService";
import { toast } from "react-toastify";
import { Copy, Share2, Calendar, Trash2, Loader2 } from "lucide-react";
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
          setLoading(true);
          const data = await getMyQrs();
          if (Array.isArray(data)) {
            setQrs(data);
        } else {
            toast.error(data?.message || "Failed to load Qrcodes");
          }
        } catch {
          toast.error("⚠️Failed to load Qrcodes");
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
    <div className=" bg-gray-100 flex flex-col min-h-screen p-6 gap-6">
      <div className="bg-white flex flex-col border rounded-sm shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
      {/* Form */}
      <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          placeholder="Enter a URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-sm focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      </div>

      {/* QR Codes List */}
      <div className="bg-white border rounded-xl shadow-lg ">
        <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Devalyze QR Codes</h2>
            <span className="text-md text-gray-500">{qrs.length} Total</span>
          </div>
           {loading ? (
            <div className="p-6 flex items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Loading Qrcodes…</span>
            </div>
          ) : qrs.length === 0 ? (
            <div className="p-6 text-gray-500">
              No Qrcodes yet. Create your first one above.
            </div>
        ) : (
          <div className="flex flex-col p-4 gap-2 ">
            {qrs.map((qr) => (
              <div
                key={qr._id}
                className=" border-b p-1 flex gap-1 items-center relative "
              >
                <div>
                <img
                  src={qr.qrCodeUrl}
                  alt="QR Code"
                  className="w-20 h-20 "
                />
                </div>
                <div >
                <p className="text-sm text-gray-600 break-all mb-1">
                  {qr.longUrl}
                </p>
                <div className="flex gap-2 absolute top-0 right-2">
                  <button>
                  < Copy 
                  className="p-1 bg-gray-300 rounded cursor-pointer"
                  onClick={() => handleCopyImage(qr.qrCodeUrl)}/>
                  </button>
                  <button>
                    <Share2 
                    onClick={() => handleShareImage(qr.qrCodeUrl)}
                    className="p-1 bg-green-500 rounded cursor-pointer"/>
                  </button>
                  <button>
                    <Trash2
                    onClick={() => handleDelete(qr._id)}
                    className="p-1 bg-red-500 rounded cursor-pointer"/>
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Scans: {qr.scans || 0}
                </p>
                <span className="text-gray-600 text-xs flex items-center gap-1">
                  <Calendar size={13} /> {new Date(qr.createdAt).toLocaleDateString()}
                </span>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
