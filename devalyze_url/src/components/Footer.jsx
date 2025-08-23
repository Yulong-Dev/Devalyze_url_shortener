import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoLinkSharp, IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const Footer = () => {
  return (
    <div className="align-center min-h-[50vh] bg-blue-950 text-white py-[8%] sm:py-[3%]">
      <div className="h-full flex flex-col sm:flex-row justify-between gap-10 sm:gap-20 flex-wrap px-30 text-center sm:text-left">
        {/* About Section */}
        <div className="flex flex-col gap-4 max-w-xs mx-auto sm:mx-0">
          <h1 className="text-2xl font-bold">Devalyze</h1>
          <p className="text-sm">
            Devalyze is an easy-to-use platform that <br />
            helps you shorten links and create QR codes <br />
            for faster sharing and smarter tracking.
          </p>
          <div className="flex justify-center sm:justify-start gap-4 text-xl">
            <div className="bg-white text-indigo-900 p-1 rounded-full">
              <Link to="/dashboard">
              <FaFacebookF />
              </Link>
            </div>
            <div className="bg-white text-indigo-900 p-1 rounded-full">
              <FaTwitter />
            </div>
            <div className="bg-white text-indigo-900 p-1 rounded-full">
              <FaInstagram />
            </div>
            <div className="bg-white text-indigo-900 p-1 rounded-full">
              <FaYoutube />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mx-auto sm:mx-0 mt-6 sm:mt-0">
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="text-sm leading-8">
            <li className="flex items-center justify-center sm:justify-start gap-2">
              <IoLinkSharp />
              Platform
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2">
              <IoLinkSharp />
              Services
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2">
              <IoLinkSharp />
              About
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-sm leading-9 mx-auto sm:mx-0 mt-6 sm:mt-0">
          <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
          <p className="flex items-center justify-center sm:justify-start gap-3">
            <FaLocationDot />
            Lagos, Nigeria.
          </p>
          <p className="flex items-center justify-center sm:justify-start gap-3">
            <IoMail />
            Devalyze@gmail.com
          </p>
          <p className="flex items-center justify-center sm:justify-start gap-3">
            <FaPhoneAlt />
            +234 90-7580-2372
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="flex justify-center mt-[6%] text-sm text-center">
        <p>&copy; 2025 Devalyze. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
