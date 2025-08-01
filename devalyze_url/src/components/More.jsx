import React from "react";
import linke from "../../public/logos/link.svg";
import qr from "../../public/logos/Group.svg";
import { FaArrowUp } from "react-icons/fa";

const More = () => {
  return (
    <div className="min-h-[200vh]">
      <main className="min-h-[140vh] flex gap-9 flex-col justify-center items-center text-center text-white bg-blue-900 py-2 px-4">
        {/* Text Section */}
        <div className="flex flex-col justify-center items-center text-center gap-3">
          <p className="text-xs sm:text-sm">CLICK.SCAN.CONNECT.IT'S THAT SIMPLE</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
            The Devalyze Link & QR Experience
          </h1>
          <p className="text-xs sm:text-sm">
            Shorten, scan, and share everything you need with your audience in one simple <br className="hidden sm:block" /> platform.
          </p>
          <button className="py-3 px-4 rounded bg-blue-600 text-xs mt-2">
            Get started for free
          </button>
        </div>

        {/* Cards Section */}
        <div className="h-auto w-full flex flex-col md:flex-row justify-center items-center gap-6">
          {/* URL Shortener Card */}
          <div className="h-auto w-full sm:w-1/4 md:w-[25%] bg-gray-100 rounded-xl">
            {/* Link cards */}
            <div className="h-60 relative flex flex-col justify-center items-center pt-8">
              <div className="flex gap-4 justify-center items-center w-72 h-14 bg-white rounded-2xl shadow-2xl z-30">
                <div className="h-9 w-9 bg-blue-500 rounded-xl flex justify-center items-center">
                  <img src={linke} alt="link.svg" />
                </div>
                <h1 className="text-black text-xl sm:text-lg">
                  yourlink.co/<span className="text-blue-500">app</span>
                </h1>
              </div>
              <div className="w-64 h-10 bg-white rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.3)] z-20 -mt-5"></div>
              <div className="w-56 h-10 bg-white rounded-2xl shadow-[0_10px_25px_rgba(59,130,246,0.3)] z-10 -mt-5"></div>
            </div>

            {/* Text Section */}
            <div className="bg-gray-200 p-6 sm:p-8 rounded-2xl w-full flex flex-col gap-3 mt-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="h-9 w-9 bg-blue-500 rounded-xl flex justify-center items-center">
                    <img src={linke} alt="link.svg" />
                  </div>
                  <h1 className="text-black text-lg">URL Shortener</h1>
                </div>
                <FaArrowUp className="text-black text-lg" />
              </div>
              <p className="text-black text-start text-sm">
                Devalyse is a powerful URL shortening solution built to help you create clean, trackable, and branded links that drive engagement. From simplifying long URLs to providing real-time click analytics, Devalyse makes it easy to share smarter.
              </p>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="h-auto w-full sm:w-1/4 md:w-[25%] bg-gray-50 rounded-xl">
            <div className="flex h-60 flex-col justify-center items-center pt-8 relative">
              <div className="relative w-full flex justify-center items-center">
                <div className="absolute">
                  <img src="/logos/Union.svg" alt="Union" />
                </div>
                <div className="bg-white flex justify-center items-center w-20 h-20 rounded-md shadow-lg relative z-10">
                  <img
                    src="/logos/Group.svg"
                    alt="QR Code"
                    className="w-16 h-16 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="bg-gray-200 p-6 sm:p-8 rounded-2xl w-full flex flex-col gap-3 mt-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="bg-white h-10 w-10 border-2 border-blue-600 rounded-md flex justify-center items-center">
                    <img src={qr} alt="qr.svg" className="h-8 w-8" />
                  </div>
                  <h1 className="text-black text-lg">QR Codes</h1>
                </div>
                <FaArrowUp className="text-black text-lg" />
              </div>
              <p className="text-black text-start  text-sm">
                Devalyse is a smart QR code solution built to help you create dynamic, scannable, and branded codes that boost interaction. Deanalyse makes it easy to connect your audience and track results all from one seamless platform.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <div className="min-h-[60vh] w-full bg-gray-100 flex flex-col justify-center items-center text-center gap-6 p-4">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-900">
          Loved by users for making link sharing <br className="hidden md:block" />
          and QR codes simple and stress-free
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <div className="bg-blue-900 h-60 w-10/12 sm:w-[12%] flex flex-col gap-3 justify-center items-start text-white rounded-lg p-6">
            <img src="/logos/contact.png" alt="contact icon" className="h-16 w-16" />
            <div className="relative inline-block">
              <h1 className="absolute top-1 text-4xl font-bold text-gray-400">500k+</h1>
              <h1 className="relative text-4xl font-bold text-white">500k+</h1>
            </div>
            <p>Global customers</p>
          </div>

          <div className="bg-blue-900 h-60 w-10/12 sm:w-[12%] flex flex-col gap-3 justify-center items-start text-white rounded-lg p-6">
            <img src="/logos/link.png" alt="scan icon" className="h-16 w-16" />
            <div className="relative inline-block">
              <h1 className="absolute top-1 text-4xl font-bold text-gray-400">256M</h1>
              <h1 className="relative text-4xl font-bold text-white">256M</h1>
            </div>
            <p>
              Links & QR Codes <br />
              created monthly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;

