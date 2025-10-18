import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import logo from "/public/logos/devalyse.png";
import signup from "/public/logos/signup.png";

const SignUp = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const API_BASE_URL =
        import.meta.env.MODE === "development"
            ? import.meta.env.VITE_API_BASE_URL_DEV
            : import.meta.env.VITE_API_BASE_URL;

    // Regular email/password signup
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "❌ Error creating account");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            login(data.token);

            toast.success(`🎉 ${fullName}! Your account has been created, Login In.`);

            setTimeout(() => {
                navigate("/SignIn");
            }, 1500);
        } catch (err) {
            toast.error("❌ Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-Up Handler
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);

            // Send the Google token to your backend
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
                toast.error(data.message || "❌ Google sign-up failed");
                setLoading(false);
                return;
            }

            // Save token and user info
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            login(data.token);

            toast.success(`🎉 Welcome ${data.user.fullName || 'back'}!`);

            setTimeout(() => {
                navigate("/dashboard"); // or wherever you want to redirect
            }, 1500);
        } catch (error) {
            console.error("Google sign-up error:", error);
            toast.error("❌ Failed to sign up with Google");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error("❌ Google sign-up was cancelled or failed");
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
            scale: [1, 1, 1],
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
                className="bg-[#EDEFFE] w-full lg:w-[50%] flex flex-col items-center justify-center gap-10 py-10 lg:py-0 p-1"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="w-[90%] sm:w-[80%] lg:w-[70%] flex flex-col items-center gap-5 pt-10 lg:pt-0 mt-10"
                    variants={itemVariants}
                >
                    {/* Logo and title */}
                    <motion.div
                        className="w-lg flex flex-col items-center gap-4 py-1 pt-0"
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
                            className="text-black font-instrument text-xl lg:text-2xl font-bold"
                            variants={itemVariants}
                        >
                            Sign up to Devalyze
                        </motion.p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        className="bg-[#fff] border-2 border-[#E8EAED] rounded-2xl px-6 lg:px-10 py-5 gap-y-3 flex flex-col w-[85%]"
                        variants={itemVariants}
                        onSubmit={handleSubmit}
                    >
                        {/* Full Name Input */}
                        <motion.div variants={itemVariants} className="flex flex-col px-1 gap-3">
                            <label className="font-geist text-black text-lg font-medium tracking-wide">
                                Fullname
                            </label>
                            <motion.input
                                whileFocus={{
                                    scale: 1.02,
                                    borderColor: "#2A27C9",
                                    boxShadow: "0 0 0 2px rgba(42, 39, 201, 0.1)",
                                }}
                                type="text"
                                placeholder="Your surname first"
                                className="w-[100%] outline-none bg-transparent border-2 py-2.5 px-3 rounded-xl border-[#dedee0] transition-colors"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </motion.div>

                        {/* Email Input */}
                        <motion.div variants={itemVariants} className="flex flex-col px-1 gap-3">
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
                                className="w-[100%] outline-none bg-transparent border-2 py-2.5 px-3 rounded-xl border-[#dedee0] transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col px-1 gap-3 relative"
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
                                className="w-full outline-none bg-transparent border-2 py-2.5 px-3 rounded-xl border-[#dedee0] transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            className={`mt-2 w-full text-white text-lg font-medium py-3 rounded-xl transition-colors 
                ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-[var(--Primary-500,#4E61F6)] hover:bg-blue-700 cursor-pointer"
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
                                    Signing up...
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
                            className="w-full mt-3 flex justify-center"
                            variants={itemVariants}
                        >
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                theme="outline"
                                size="large"
                                width="100%"
                                text="signup_with"
                                shape="rectangular"
                            />
                        </motion.div>

                        {/* Sign In Link */}
                        <motion.div
                            className="flex gap-1 place-self-center items-center mt-2"
                            variants={itemVariants}
                        >
                            <p className="text-[#aeaeae] text-center font-geist lg:text-lg font-medium tracking-wide">
                                Already have an account?
                            </p>
                            <Link
                                to="/SignIn"
                                className="text-[#4e61f6] font-geist font-lg font-medium tracking-wide hover:underline"
                            >
                                Login
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
                    By creating an account, you agree to the Terms of Service and Privacy Policy
                </motion.div>
            </motion.div>

            {/* Right Panel - Image Section */}
            <div className="hidden lg:block w-[50%] overflow-hidden">
                <motion.img
                    src={signup}
                    alt="Phone"
                    className="h-full w-auto object-contain object-bottom-right"
                    variants={imageVariants}
                    initial="hidden"
                    animate={["visible", "pulse"]}
                />
            </div>
        </div>
    );
};

export default SignUp;