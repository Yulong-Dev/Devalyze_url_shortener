import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Install lucide-react for icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full px-6 md:px-16 py-6 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-24 bg-white shadow-xl rounded-lg flex items-center justify-center">
          <h1 className="text-blue-900 font-outfit">Devalyze</h1>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-9 text-[15px] font-medium text-gray-700">
        <button className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">Platform</button>
        <a href="#" className="hover:text-black">Services</a>
        <a href="#" className="hover:text-black pr-2">About</a>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
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

      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-white shadow-md rounded-md px-6 py-4 md:hidden z-50">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            <li><button className="w-full text-left px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded">Platform</button></li>
            <li><a href="#" className="hover:text-black">Services</a></li>
            <li><a href="#" className="hover:text-black">About</a></li>
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <a href="/signup">
              <button className="w-full text-sm px-5 py-2 rounded-lg bg-white text-gray-700 shadow-sm border">
                Sign Up
              </button>
            </a>
            <a href="/login">
              <button className="w-full text-sm px-5 py-2 rounded-lg shadow-sm bg-blue-500 text-white hover:bg-blue-700">
                Login
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
