import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import TrustedBy from "../components/TrustedBy"; // ✅ update path for ReactJS

export default function Hero() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("short");
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setShortUrl("");
      setQrCodeUrl("");
      setCountdown(null);
    } else {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = activeTab === "short" ? "shorten" : "qr";

      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        if (activeTab === "short") {
          setShortUrl(data.shortUrl);
        } else {
          setQrCodeUrl(data.qrCodeUrl);
        }
        setLongUrl("");
        setCountdown(30);
      } else {
        alert(data.error || "Failed to process URL");
      }
    } catch (err) {
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy!");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-100 items-center  gap-15">
      <Navbar />
      <div className="flex flex-col gap-8 text-center items-center justify-center">
        <div className="flex bg-white justify-center shadow-lg rounded-lg p-1">
          <div className="flex -space-x-2 px-1">
            <img className="w-5 h-4 rounded-full border-2 border-white" src="/user1.jpg" alt="User 1" />
            <img className="w-5 h-4 rounded-full border-2 border-white" src="/user2.jpg" alt="User 2" />
            <img className="w-5 h-4 rounded-full border-2 border-white" src="/user3.jpg" alt="User 3" />
          </div>
          <p className="sm:text-xs font-thin">Shorten Your Links with Ease</p>
        </div>

        <h1 className="text-4xl sm:text-6xl text-center">
          Shorten, Customize, and <br /> Share Your Links in One Click
        </h1>

        <h3 className="text-sm sm:text-base text-center">
          Easily create branded short links and QR codes to connect your
          audience with the right <br />
          content faster, smarter, and with full tracking to help you measure
          what matters.
        </h3>

        <div className="flex gap-4 flex-col sm:flex-row items-center">
          <button
            className={`px-4 py-3 rounded-xl shadow-lg transition ${
              activeTab === "short" ? "bg-blue-500 text-white" : "bg-white text-black"
            }`}
            onClick={() => setActiveTab("short")}
          >
            Short Links
          </button>

          <button
            className={`px-5 py-3 rounded-xl shadow-lg transition ${
              activeTab === "qr" ? "bg-blue-500 text-white" : "bg-white text-black"
            }`}
            onClick={() => setActiveTab("qr")}
          >
            QR Codes
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md h-5 w-8 rounded-3xl flex items-center justify-center">
        <ArrowDownIcon className="w-3 h-3" />
      </div>

      <div className="relative w-11/12 sm:w-[65%]">
       <div className="absolute top-2 left-2 md:top-8 md:left-8 w-full h-full bg-blue-950 rounded-2xl z-0"></div>

       <div className="flex flex-col gap-5 relative w-full bg-white rounded-2xl shadow-md z-10 px-5 sm:px-15 py-5">
          <h2 className="text-3xl">
            {activeTab === "short" ? "Shorten a long link" : "Generate a QR code"}
          </h2>
          <p className="text-xs">No credit card required</p>
          <h3>Paste your long link here</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter your long URL"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-41 px-5 py-3 rounded-xl bg-blue-950 text-white text-xs ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800 transition"
              }`}
            >
              {loading
                ? activeTab === "short"
                  ? "Fetching..."
                  : "Generating..."
                : activeTab === "short"
                ? "Get your link for free"
                : "Get your QR code"}
            </button>
          </form>

          {shortUrl && activeTab === "short" && (
            <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-between">
              <span className="text-blue-700 font-semibold">{shortUrl}</span>
              <button
                onClick={() => copyToClipboard(shortUrl)}
                className="ml-4 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
              >
                Copy
              </button>
              {countdown !== null && (
                <p className="text-sm text-gray-500 mt-1">
                  Short url will disappear in <span className="font-semibold">{countdown}</span>s
                </p>
              )}
            </div>
          )}

          {qrCodeUrl && activeTab === "qr" && (
            <div className="flex flex-col items-center gap-2">
              <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" />
              <button
                onClick={() => copyToClipboard(qrCodeUrl)}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
              >
                Copy Image URL
              </button>
              {countdown !== null && (
                <p className="text-sm text-gray-500 mt-1">
                  QR Code will disappear in <span className="font-semibold">{countdown}</span>s
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col py-10 gap-3 h- w-full  text-center bg-gray-100">
        <p>
          Trusted by 200,000+ users in 130+ countries to simplify sharing and expand their reach.
        </p>
        <TrustedBy className="sm:w-[80%]" />
      </div>
    </main>
  );
}
