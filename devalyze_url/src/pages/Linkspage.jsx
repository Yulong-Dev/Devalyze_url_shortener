import React, { useEffect, useState } from "react";
import { createShortUrl, getMyUrls, deleteUrl } from "../services/urlService";
import { Copy, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const SHORT_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"         // Backend base for redirects (dev)
    : "https://dvilz.onrender.com";   // Backend base for redirects (prod)

const LinksPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await getMyUrls();
      if (Array.isArray(data)) {
        setUrls(data);
      } else {
        toast.error(data?.message || "Failed to load links");
      }
    } catch {
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = longUrl.trim();
    if (!value) return;

    try {
      setCreating(true);
      const res = await createShortUrl(value);
      if (res?.shortUrl || res?.shortCode) {
        toast.success("Short link created");
        setLongUrl("");
        await loadLinks();
      } else {
        toast.error(res?.message || res?.error || "Could not create short link");
      }
    } catch {
      toast.error("Could not create short link");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUrl(id);
      toast.success("Deleted");
      await loadLinks();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Prefer backend-provided shortUrl; else compose from shortCode
  const getShort = (u) => u.shortUrl || `${SHORT_BASE_URL}/${u.shortCode}`;

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.info("Copied");
    } catch {}
  };

  return (
    <div className="bg-gray-100 flex flex-col  min-h-screen gap-6 p-4 sm:p-6">
      <div className="bg-white border rounded-sm shadow-lg p-8 ">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">URL Shortener</h1>

        {/* Create form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl flex flex-col sm:flex-row gap-3"
        >
          <input
            type="url"
            required
            placeholder="Paste a long URL (https://...)"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="flex-1 border rounded-sm px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--Primary-500,#4E61F6)]"
          />
          <button
            type="submit"
            disabled={creating}
            className={`px-4 py-2 rounded-sm text-white font-medium ${
              creating
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-[var(--Primary-500,#4E61F6)] hover:bg-blue-700"
            }`}
          >
            {creating ? "Shortening..." : "Shorten"}
          </button>
        </form>
        </div>

        {/* List */}
        <div className="bg-white border rounded-xl shadow-lg">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Devalyze Links</h2>
            <span className="text-md text-gray-500">{urls.length} Total</span>
          </div>

          {loading ? (
            <div className="p-6 flex items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Loading links…</span>
            </div>
          ) : urls.length === 0 ? (
            <div className="p-6 text-gray-500">
              No links yet. Create your first one above.
            </div>
          ) : (
            <ul className="divide-y">
              {urls.map((u) => {
                const short = getShort(u);
                return (
                  <li
                    key={u._id}
                    className="p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {u.title || u.longUrl}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                        <a
                          href={u.longUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 underline truncate max-w-[18rem] sm:max-w-xs"
                          title={u.longUrl}
                        >
                          {u.longUrl}
                        </a>
                        <span>→</span>
                        <a
                          href={short}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                          title={short}
                        >
                          {short} <ExternalLink className="h-4 w-4" />
                        </a>
                        <span className="text-gray-500">
                          • {u.clicks ?? 0} clicks
                        </span>
                        <span className="text-gray-400">
                          • {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copy(short)}
                        className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Copy className="h-4 w-4" /> Copy
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-3 py-2 border rounded-lg text-sm text-red-600 hover:bg-red-50 flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      
    </div>
  );
};

export default LinksPage;
