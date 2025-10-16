/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CgMenuLeft } from "react-icons/cg";
import { MdClose } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/public/logos/devalyse.png";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Motion version of React Router Link
    const MotionLink = motion(Link);

    // Animation variants
    const menuVariants = {
        hidden: { opacity: 0, x: "100%" },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", damping: 25, stiffness: 200 },
        },
        exit: {
            opacity: 0,
            x: "100%",
            transition: { duration: 0.3, ease: "easeInOut" }
        },
    };

    const navItem = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.1 * i, duration: 0.3 },
        }),
    };

    const links = [
        { name: "Services", link: "/services" },
        { name: "About", link: "/about" },
    ];

    return (
        <nav className="w-full px-4 sm:px-6 lg:px-16 py-4 sm:py-6 flex items-center justify-between relative font-instrument bg-transparent">
            {/* Logo */}
            <motion.div
                className="flex items-center gap-2 z-50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="h-10 sm:h-12 px-3 sm:px-4 gap-2 sm:gap-3 bg-white shadow-md rounded-lg flex items-center justify-center">
                    <LazyLoadImage
                        src={logo}
                        alt="Devalyze Logo"
                        className="w-5 sm:w-7 h-5 sm:h-7"
                        effect="opacity"
                    />
                    <h1 className="text-blue-900 text-center text-base sm:text-lg font-thin whitespace-nowrap">
                        Devalyze
                    </h1>
                </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
                className="hidden md:flex items-center gap-3 lg:gap-5 text-sm lg:text-[15px] bg-white shadow-md rounded-xl px-2 py-1 font-medium text-gray-700"
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
                    className="px-3 lg:px-4 py-2 h-10 lg:h-11 rounded-lg flex items-center justify-center gap-1 bg-[#f2f2f2] transition-colors"
                >
                    <p className="text-black text-sm lg:text-md font-normal">Platform</p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        fill="none"
                        className="lg:w-[18px] lg:h-[18px]"
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

                {links.map((item, i) => (
                    <MotionLink
                        key={item.name}
                        to={item.link}
                        className="hover:text-black text-[#4D4D4D] text-sm lg:text-md font-normal px-2 lg:px-3 transition-colors"
                        custom={i}
                        variants={navItem}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ color: "#000", scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {item.name}
                    </MotionLink>
                ))}
            </motion.div>

            {/* Desktop Auth Buttons */}
            <motion.div
                className="hidden md:flex items-center gap-2 lg:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <MotionLink
                    to="/SignUp"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm lg:text-md font-normal px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl bg-white text-black shadow-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                    Sign Up
                </MotionLink>

                <MotionLink
                    to="/SignIn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm lg:text-md font-normal px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl shadow-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
                >
                    Login
                </MotionLink>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
                className="md:hidden z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? (
                    <MdClose className="w-6 h-6 text-gray-800" />
                ) : (
                    <CgMenuLeft className="w-6 h-6 text-gray-800" />
                )}
            </motion.button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-30 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            className="fixed top-0 right-0 bottom-0 w-[75%] max-w-sm bg-white z-40 shadow-2xl md:hidden overflow-y-auto"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuVariants}
                        >
                            {/* Close Button */}
                            <div className="flex justify-end p-4 border-b border-gray-100">
                                <motion.button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <MdClose className="w-6 h-6 text-gray-800" />
                                </motion.button>
                            </div>

                            {/* Menu Content */}
                            <div className="flex flex-col gap-2 p-4">
                                {/* Platform Button */}
                                <motion.button
                                    className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 flex items-center justify-between hover:bg-gray-200 transition-colors"
                                    whileTap={{ scale: 0.98 }}
                                    custom={0}
                                    variants={navItem}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <span className="text-black text-base font-normal">Platform</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
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

                                {/* Navigation Links */}
                                {links.map((item, i) => (
                                    <MotionLink
                                        key={item.name}
                                        to={item.link}
                                        className="w-full px-4 py-3 text-[#4D4D4D] hover:text-black hover:bg-gray-50 text-base font-normal rounded-lg transition-colors"
                                        custom={i + 1}
                                        variants={navItem}
                                        initial="hidden"
                                        animate="visible"
                                        onClick={() => setIsOpen(false)}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {item.name}
                                    </MotionLink>
                                ))}

                                {/* Divider */}
                                <div className="my-4 border-t border-gray-200" />

                                {/* Mobile Auth Buttons */}
                                <div className="flex flex-col gap-3">
                                    <MotionLink
                                        to="/SignUp"
                                        variants={navItem}
                                        custom={links.length + 1}
                                        initial="hidden"
                                        animate="visible"
                                        onClick={() => setIsOpen(false)}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-5 py-3 rounded-xl bg-white text-black border-2 border-gray-300 text-base font-medium hover:bg-gray-50 transition-colors text-center"
                                    >
                                        Sign Up
                                    </MotionLink>
                                    <MotionLink
                                        to="/SignIn"
                                        variants={navItem}
                                        custom={links.length + 2}
                                        initial="hidden"
                                        animate="visible"
                                        onClick={() => setIsOpen(false)}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-5 py-3 rounded-xl bg-blue-500 text-white text-base font-medium hover:bg-blue-600 transition-colors text-center shadow-md"
                                    >
                                        Login
                                    </MotionLink>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}