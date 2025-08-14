import { Link } from "react-router-dom";
import React, { useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { MdClose } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/public/logos/devalyse.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const navItem = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.3,
      },
    }),
  };

  return (
    <nav className="w-full px-6 md:px-16 py-6 flex items-center justify-between relative font-instrument">
      {/* Logo with animation */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-12 w-35 gap-3 bg-white shadow-md rounded-lg flex items-center justify-center">
          <LazyLoadImage
            src={logo}
            alt="Devalyze Logo"
            className="w-7"
            effect="opacity"
          />
          <h1 className="text-blue-900 text-center text-lg font-thin">
            Devalyze
          </h1>
        </div>
      </motion.div>

      {/* Desktop Navigation */}
      <motion.div
        className="hidden md:flex items-center gap-5 text-[15px] bg-white shadow-md rounded-xl p-1 font-medium text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          whileHover={{
            backgroundColor: "#f3f4f6",
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98 }}
          className="px-3 py-2 h-11 rounded-lg flex items-center justify-center gap-1 bg-[#f2f2f2]"
        >
          <p className="text-black text-md font-normal">Platform</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="15"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M13.5 7.375L9 11.875L4.5 7.375"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
           
        </motion.button>

        {["Services", "About"].map((item, i) => (
          <motion.a
            key={item}
            href="#"
            className="hover:text-black text-[#4D4D4D] text-md font-normal px-2"
            custom={i}
            variants={navItem}
            initial="hidden"
            animate="visible"
            whileHover={{ color: "#000" }}
          >
            {item}
          </motion.a>
        ))}
      </motion.div>

      {/* Desktop Auth Buttons */}
      <motion.div
        className="hidden lg:flex items-center gap-4 h-11"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.a
          href="/signup"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/SignUp"
            className="text-md font-normal px-5 py-3.5 rounded-xl bg-white text-black shadow-sm h-11 hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </Link>
        </motion.a>
        <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/SignIn"
            className="text-md font-normal px-5 py-3.5 rounded-xl shadow-sm bg-blue-500 text-white hover:bg-blue-600 h-11 transition-colors"
          >
            Login
          </Link>
        </motion.a>

       
      </motion.div>

      {/* Mobile Menu Toggle Button */}
      <motion.button
        className="md:hidden z-50 p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <MdClose className="w-6 h-6" />
        ) : (
          <CgMenuLeft className="w-6 h-6" />
        )}
      </motion.button>

      {/* Mobile Menu with animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-40 pt-24 px-6 md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className="flex flex-col gap-4">
              {/* Mobile Navigation Links */}
              <motion.button
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 flex items-center justify-between"
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-black text-md font-normal">Platform</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M13.5 7.375L9 11.875L4.5 7.375"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>

              {["Services", "About"].map((item, i) => (
                <motion.a
                  key={item}
                  href="#"
                  className="px-4 py-3 text-[#4D4D4D] hover:text-black text-md font-normal border-b border-gray-100"
                  custom={i + 1}
                  variants={navItem}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </motion.a>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col p-1 gap-4 mt-4 min-h w-full" >
                <Link
                  to="/SignUp"
                  variants={navItem}
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-5 py-3 rounded-xl bg-white text-black border border-gray-300 text-lg font-normal hover:bg-gray-50 transition-colors text-center" 
                >
                    Sign Up
                  
                </Link>
                <Link
                  to="/SignIn"
                  variants={navItem}
                  custom={3.5}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-5 py-3 rounded-xl bg-blue-500 text-white text-lg font-normal hover:bg-blue-600 transition-colors text-center"
                >
                    Login
                  
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
