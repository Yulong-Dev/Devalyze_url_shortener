import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "/public/logos/devalyse.png";
import phone from "/public/logos/phone1.png";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000" // Local backend
      : "https://devalyze-url-shortener.onrender.com"; // Render backend

  

  const handleLogin = async (e) => {
    e.preventDefault();

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
        return;
      }

      // Save token & user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Show personalized welcome toast
      toast.success(`👋 Welcome back, ${data.user.fullName || "User"}!`);

      // Wait so the toast is visible before redirecting
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong, please try again later.");
    }
  };

  // All your existing animation variants remain exactly the same
  // ... (keep all your existing variants) ...
  const imageVariants = {
    hidden: {
      opacity: 0,
      x: -100,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    pulse: {
      scale: [1, 1.05, 1], // Keyframes for pulsing
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
  // const formItemVariants = {
  //         hidden: { x: -20, opacity: 0 },
  //         visible: {
  //             x: 0,
  //             opacity: 1,
  //             transition: {
  //                 duration: 0.5,
  //                 ease: "easeOut"
  //             }
  //         }
  //     };

  //     const buttonVariants = {
  //         hidden: { scale: 0.95, opacity: 0 },
  //         visible: {
  //             scale: 1,
  //             opacity: 1,
  //             transition: {
  //                 duration: 0.4,
  //                 ease: "easeOut"
  //             }
  //         },
  //         hover: { scale: 1.05 },
  //         tap: { scale: 0.98 }
  //     };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Changed from buttonVariants to linkVariants
  const linkVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(42, 39, 201, 0.3)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  const googleButtonVariants = {
    hover: {
      backgroundColor: "#f5f5f5",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
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
        {/* Card container - width adjusted for mobile */}
        <motion.div
          className="w-[90%] sm:w-[80%] lg:w-[70%] flex flex-col items-center gap-5 pt-10 lg:pt-20"
          variants={itemVariants}
        >
          {/* Logo and title - unchanged except responsive text */}
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

          {/* Form - padding adjusted for mobile */}
          <motion.form
            className="bg-[#fff] border-2 border-[#E8EAED] rounded-2xl px-6 lg:px-10 py-5 gap-y-4 flex flex-col w-[80%]"
            variants={itemVariants}
            onSubmit={handleLogin}
          >
            {/* All form fields remain EXACTLY the same */}
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

            {/* All buttons remain exactly the same */}
            <motion.button
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="mt-2 w-full bg-[var(--Primary-500,#4E61F6)] text-white text-lg font-medium py-3 rounded-xl  cursor-pointer transition-colors text-center"
            >
              Continue
            </motion.button>

            {/* Divider remains exactly the same */}
            <motion.div
              className="flex items-center gap-2 place-self-center text-[#9b9b9b] text-md font-medium font-geist mt-3"
              variants={itemVariants}
            >
              <motion.hr
                className="w-30 "
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
              />
              OR
              <motion.hr
                className="w-30 "
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
              />
            </motion.div>

            {/* Google button remains exactly the same */}
            <motion.button
              className="w-full outline-none hover:cursor-pointer bg-transparent border-2 py-2 px-3 rounded-xl border-[#dedee0] flex items-center justify-center gap-5 mt-3 transition-colors"
              variants={googleButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {/* Google SVG icon remains exactly the same */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 19 20"
                fill="none"
              >
                <g opacity="0.9" clip-path="url(#clip0_2880_619)">
                  <path
                    d="M18.7979 10.2138C18.7979 9.58841 18.7425 8.99466 18.6475 8.41675H9.70166V11.9872H14.8237C14.5942 13.1588 13.9212 14.1484 12.9237 14.8213V17.1963H15.9796C17.7687 15.5418 18.7979 13.1034 18.7979 10.2138Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9.70189 19.5001C12.2669 19.5001 14.4124 18.6451 15.9799 17.1963L12.9239 14.8213C12.0689 15.3913 10.9844 15.7396 9.70189 15.7396C7.22399 15.7396 5.12607 14.0693 4.37399 11.813H1.22314V14.2593C2.78274 17.3626 5.98899 19.5001 9.70189 19.5001Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.37375 11.8128C4.17583 11.2428 4.07291 10.6332 4.07291 9.99988C4.07291 9.36655 4.18375 8.75697 4.37375 8.18697V5.74072H1.22291C0.573743 7.02322 0.20166 8.46405 0.20166 9.99988C0.20166 11.5357 0.573743 12.9766 1.22291 14.2591L4.37375 11.8128Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9.7019 4.26042C11.1031 4.26042 12.3539 4.74334 13.3436 5.68542L16.0511 2.97792C14.4124 1.44208 12.2669 0.5 9.7019 0.5C5.98899 0.5 2.78274 2.6375 1.22314 5.74084L4.37399 8.18709C5.12607 5.93084 7.22399 4.26042 9.7019 4.26042Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2880_619">
                    <rect
                      width="19"
                      height="19"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <p className="text-[#1e1f27] font-geist text-lg font-medium">
                Continue with Google
              </p>
            </motion.button>

            {/* Sign up link remains exactly the same */}
            <motion.div
              className="flex gap-1 place-self-center items-center"
              variants={itemVariants}
            >
              <p className="text-[#aeaeae] text-center font-geist text-lg font-medium tracking-wide">
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

        {/* Footer text - only text size adjusted for mobile */}
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

      {/* Right Panel - Image Section (hidden on mobile) */}
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
