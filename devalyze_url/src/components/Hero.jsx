import { useState } from "react";
import Navbar from "./Navbar";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import TrustedBy from "../components/TrustedBy";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import user1 from "/public/logos/user1.png";
import user2 from "/public/logos/user2.png";
import user3 from "/public/logos/user3.png";

export default function Hero() {
  const [activeTab, setActiveTab] = useState("short");
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-gray-100 items-center gap-15 relative">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col gap-8 text-center items-center justify-center">
        <div className="flex bg-white justify-center shadow-lg rounded-3xl py-1 px-2 items-center">
          <div className="flex -space-x-3 px-2">
            <LazyLoadImage
              className="w-8 h-8 rounded-full border-2 border-white object-cover object-center"
              src={user1}
              alt="User 1"
            />
            <LazyLoadImage
              className="w-8 h-8 rounded-full border-2 border-white object-cover object-center"
              src={user2}
              alt="User 2"
            />
            <LazyLoadImage
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              src={user3}
              alt="User 3"
            />
          </div>
          <p className="sm:max-md:text-xs text-md text-[#262626] font-instrument font-medium text-center">
            Shorten Your Links with Ease
          </p>
        </div>

        <h1 className="text-4xl font-bold sm:text-6xl text-center sm:px-80 px-4">
          Shorten, Customize, and Share Your Links in One Click
        </h1>

        <h3 className="text-sm sm:text-base text-gray-600 sm:px-95 px-10 text-center">
          Easily create branded short links and QR codes to connect your
          audience with the right content faster, smarter, and with full
          tracking to help you measure what matters.
        </h3>

        {/* Tabs */}
        <div className="flex gap-4 items-center">
          <button
            className={`px-4 py-3 rounded-xl shadow-lg transition ${
              activeTab === "short"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setActiveTab("short")}
          >
            Short Links
          </button>

          <button
            className={`px-5 py-3 rounded-xl shadow-lg transition ${
              activeTab === "qr"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setActiveTab("qr")}
          >
            QR Codes
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md h-5 w-8 rounded-3xl flex items-center justify-center mt-4">
        <ArrowDownIcon className="w-3 h-3" />
      </div>

      {/* Form Section */}
      <div className="relative w-11/12 sm:w-[65%]">
        <div className="absolute top-2 left-2 md:top-8 md:left-8 w-full h-full bg-blue-950 rounded-2xl z-0"></div>

        <div className="flex flex-col gap-5 relative w-full bg-white rounded-2xl shadow-md z-10 px-5 sm:px-15 py-5">
          <h2 className="text-3xl text-[#1a1a1a] font-instrument font-semibold">
            {activeTab === "short"
              ? "Shorten a long link"
              : "Generate a QR code"}
          </h2>
          <p className="text-xs text-[#031f39] font-Inter">
            No credit card required
          </p>
          <h3 className="text-[#131927] font-instrument text-sm font-semibold">
            Paste your long link here
          </h3>

        
          <input
            type="text"
            placeholder="https://example.com/my-long-url"
            className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-400 "
          />

          {/* Action Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-41 px-5 py-3.5 rounded-xl bg-[#212967] text-white text-xs font-Inter hover:bg-blue-800 transition"
          >
            {activeTab === "short"
              ? "Get your link for free"
              : "Get your QR code"}
          </button>
        </div>
      </div>

      {/* Trusted By */}
      <div className="flex flex-col py-10 gap-4 w-full text-center bg-gray-100">
        <p>
          Trusted by 200,000+ users in 130+ countries to simplify sharing and
          expand their reach.
        </p>
        <TrustedBy className="sm:w-[80%]" />
      </div>

      {/* ✨ Frosted Glass Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-white/30">
          <div className="bg-white/70 backdrop-blur-lg border border-white/40 shadow-2xl p-8 rounded-2xl w-[90%] sm:w-[380px] text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sign up or log in
            </h2>
            <p className="text-gray-700 mb-6 text-sm">
              You need an account to use Devalyze.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/SignIn"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/SignUp"
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
