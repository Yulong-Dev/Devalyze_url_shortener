import React from 'react';

export default function Navbar() {
  return (
    <nav className="w-full px-6 md:px-16 py-6  flex items-baseline justify-between">
      {/* Left side: Logo + Nav */}
      <div className="flex items-center justify-center gap-12 h-9 w-24 bg-white shadow-xl rounded-lg">
        <h1 className="text-blue-900 font-outfit">Devalyze</h1>
      </div>

      {/* Nav Links */}
      <div className="bg-white rounded-lg shadow-sm py-1 px-1">
        <ul className="hidden md:flex items-center gap-9 text-[15px] font-medium text-gray-700">
          <li>
            <button className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">Platform</button>
          </li>
          <li>
            <a href="#" className="hover:text-black">Services</a>
          </li>
          <li>
            <a href="#" className="hover:text-black pr-2">About</a>
          </li>
        </ul>
      </div>

      {/* Right side: Auth buttons */}
      <div className="flex items-center gap-4">
        <a href="/signup">
          <button className="text-sm px-5 py-2 rounded-lg bg-white text-gray-700 shadow-sm">
            Sign Up
          </button>
        </a>
        <a href="/login">
          <button className="text-sm px-5 py-2 rounded-lg shadow-sm bg-blue-500 text-white hover:bg-blue-700">
            Login
          </button>
        </a>
      </div>
    </nav>
  );
}
