/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import logo from "/public/logos/devalyse.png";
import phone from "/public/logos/phone1.png";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_BASE_URL =
        import.meta.env.MODE === "development"
            ? "http://localhost:5000"
            : "https://dvilz.onrender.com";

    // Regular email/password login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "❌ Login failed");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            const decoded = jwtDecode(data.token);
            if (decoded.exp) {
                localStorage.setItem("token_exp", decoded.exp * 1000);
            }

            toast.success(`👋 Welcome back, ${data.user.fullName || "User"}!`);

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);
        } catch (err) {
            console.error(err);
            toast.error("❌ Something went wrong, please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In Handler
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: credentialResponse.credential,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "❌ Google sign-in failed");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            const decoded = jwtDecode(data.token);
            if (decoded.exp) {
                localStorage.setItem("token_exp", decoded.exp * 1000);
            }

            toast.success(`👋 Welcome back, ${data.user.fullName || "User"}!`);

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error("❌ Failed to sign in with Google");
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
                        className="w-lg flex flex-col items-center gap-6 py-1 pt-10"
                        variants={itemVariants}
                    >
                        <motion.img
                            src={logo}
                            className="w-15"
                            alt="Devalyze logo"
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

                    {/* Form */}
                    <motion.form
                        className="bg-[#fff] border-2 border-[#E8EAED] rounded-2xl px-6 lg:px-10 py-5 gap-y-4 flex flex-col w-[80%]"
                        variants={itemVariants}
                        onSubmit={handleLogin}
                    >
                        {/* Email Input */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col px-1 gap-5"
                        >
                            <label className="font-geist text-black text-lg font-medium tracking-wide">
                                Email
                            </label>
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
                                className="w-[100%] outline-none bg-transparent border-2 py-2.5 px-3 rounded-xl border-[#dedee0] transition-colors"
                            />
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col px-1 gap-5 relative"
                        >
                            <label className="font-link text-lg font-medium">Password</label>
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
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[74%] transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            variants={linkVariants}
                            whileHover="hover"
                            whileTap="tap"
                            type="submit"
                            disabled={loading}
                            className={`mt-2 w-full text-white text-lg font-medium py-3 rounded-xl cursor-pointer transition-colors text-center 
                ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-[var(--Primary-500,#4E61F6)] hover:bg-blue-700"
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Logging in...
                                </div>
                            ) : (
                                "Continue"
                            )}
                        </motion.button>

                        {/* Divider */}
                        <motion.div
                            className="flex items-center gap-2 place-self-center text-[#9b9b9b] text-md font-medium font-geist mt-3"
                            variants={itemVariants}
                        >
                            <motion.hr
                                className="w-20 lg:w-30"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                            />
                            OR
                            <motion.hr
                                className="w-20 lg:w-30"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                            />
                        </motion.div>

                        {/* Google Sign-In Button */}
                        <motion.div
                            className="flex justify-center items-center w-full mt-4"
                            variants={itemVariants}
                        >
                            <div className="w-full max-w-sm">
                                <div className="rounded-xl py-2 px-3 bg-transparent hover:cursor-pointer transition-colors flex justify-center items-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        useOneTap
                                        theme="outline"
                                        size="large"
                                        width="100%"
                                        text="signin_with"
                                        shape="rectangular"
                                    />
                                </div>
                            </div>
                        </motion.div>


                        {/* Sign Up Link */}
                        <motion.div
                            className="flex gap-1 place-self-center items-center mt-2"
                            variants={itemVariants}
                        >
                            <p className="text-[#aeaeae] text-center font-geist text-sm lg:text-lg font-medium tracking-wide">
                                Don't have an account?
                            </p>
                            <Link
                                to="/SignUp"
                                className="text-[#4e61f6] font-geist font-lg font-medium tracking-wide hover:underline"
                            >
                                Sign up
                            </Link>
                        </motion.div>
                    </motion.form>
                </motion.div>

                {/* Footer text */}
                <motion.div
                    className="text-center w-[80%] lg:w-70 text-[#0004199E]/0.62 opacity-60 font-instrument text-sm lg:text-md pb-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.8 }}
                >
                    By creating an account, you agree to the Terms of Service and Privacy
                    Policy
                </motion.div>
            </motion.div>

            {/* Right Panel - Image Section */}
            <div className="hidden lg:block w-[40%] overflow-hidden pt-15">
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