/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import logo from "/public/logos/devalyse.png";
import phone from "/public/logos/phone1.png";

import { api, handleResponse } from "../utils/api.js";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Regular email/password login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/api/auth/login", { email, password });
            const data = await handleResponse(response);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            const decoded = jwtDecode(data.token);
            if (decoded.exp) localStorage.setItem("token_exp", decoded.exp * 1000);

            toast.success(`👋 Welcome back, ${data.user.fullName || "User"}!`);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "❌ Login failed");
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In Handler
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const response = await api.post("/api/auth/google", {
                token: credentialResponse.credential,
            });
            const data = await handleResponse(response);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            const decoded = jwtDecode(data.token);
            if (decoded.exp) localStorage.setItem("token_exp", decoded.exp * 1000);

            toast.success(`👋 Welcome back, ${data.user.fullName || "User"}!`);
            navigate("/dashboard");
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error(error.message || "❌ Failed to sign in with Google");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error("❌ Google sign-in was cancelled or failed");
    };

    // Animation variants
    const imageVariants = {
        hidden: { opacity: 0, x: -100, scale: 0.8 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" },
        },
        pulse: {
            scale: [1, 1.05, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const linkVariants = {
        hover: {
            scale: 1.03,
            boxShadow: "0px 5px 15px rgba(42, 39, 201, 0.3)",
            transition: { duration: 0.2 },
        },
        tap: { scale: 0.98, transition: { duration: 0.1 } },
    };

    return (
        <div className="text-black flex flex-col lg:flex-row min-h-screen">
            {/* Left Panel - Form Section */}
            <motion.div
                className="bg-[#EDEFFE] w-full lg:w-[60%] flex flex-col items-center justify-center gap-10 py-10 lg:py-0"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="w-[90%] sm:w-[80%] lg:w-[70%] flex flex-col items-center gap-5 pt-10 lg:pt-20"
                    variants={itemVariants}
                >
                    {/* Logo and title */}
                    <motion.div
                        className="flex flex-col items-center gap-6 py-1 pt-10"
                        variants={itemVariants}
                    >
                        <motion.img
                            src={logo}
                            alt="Devalyze logo"
                            className="w-15"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        />
                        <motion.p
                            className="text-black font-instrument tracking-wider text-xl lg:text-2xl font-bold"
                            variants={itemVariants}
                        >
                            Login to Devalyze
                        </motion.p>
                    </motion.div>

                    {/* Login Form */}
                    <motion.form
                        onSubmit={handleLogin}
                        className="bg-white border-2 border-[#E8EAED] rounded-2xl px-6 lg:px-10 py-5 flex flex-col gap-5 w-[80%]"
                        variants={itemVariants}
                    >
                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-lg font-medium">Email</label>
                            <motion.input
                                whileFocus={{
                                    scale: 1.02,
                                    borderColor: "#2A27C9",
                                    boxShadow: "0 0 0 2px rgba(42, 39, 201, 0.1)",
                                }}
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full outline-none bg-transparent border-2 py-2.5 px-3 rounded-xl border-[#dedee0] transition-colors"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-lg font-medium">Password</label>
                            <motion.input
                                whileFocus={{
                                    scale: 1.02,
                                    borderColor: "#2A27C9",
                                    boxShadow: "0 0 0 2px rgba(42, 39, 201, 0.1)",
                                }}
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full outline-none bg-transparent border-2 py-2.5 px-3 rounded-xl border-[#dedee0] transition-colors pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                        {/* Submit */}
                        <motion.button
                            variants={linkVariants}
                            whileHover="hover"
                            whileTap="tap"
                            type="submit"
                            disabled={loading}
                            className={`mt-2 w-full text-white text-lg font-medium py-3 rounded-xl transition-colors ${
                                loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-[var(--Primary-500,#4E61F6)] hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Logging in..." : "Continue"}
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center justify-center gap-3 text-[#9b9b9b] font-medium mt-3">
                            <hr className="w-20 border-gray-300" /> OR{" "}
                            <hr className="w-20 border-gray-300" />
                        </div>

                        {/* Google Login */}
                        <div className="flex justify-center mt-4">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                theme="outline"
                                size="large"
                                text="signin_with"
                            />
                        </div>

                        {/* Sign Up Link */}
                        <div className="flex justify-center items-center gap-1 mt-3">
                            <p className="text-[#aeaeae] text-sm">Don't have an account?</p>
                            <Link
                                to="/SignUp"
                                className="text-[#4e61f6] font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </div>
                    </motion.form>
                </motion.div>
            </motion.div>

            {/* Right Panel - Image Section */}
            <div className="hidden lg:block w-[40%] overflow-hidden">
                <motion.img
                    src={phone}
                    alt="Phone"
                    className="object-cover object-center h-180"
                    variants={imageVariants}
                    initial="hidden"
                    animate={["visible", "pulse"]}
                />
            </div>
        </div>
    );
};

export default SignIn;
