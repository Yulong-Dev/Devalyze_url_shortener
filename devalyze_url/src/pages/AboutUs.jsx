import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Page Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        About us
                    </h1>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mb-8"
                >
                    <div className="bg-[#6363F1] rounded-[20px] p-8 md:p-12 shadow-lg">
                        <div className="flex items-start gap-4 mb-4">
                            <Target className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                Our mission:
                            </h2>
                        </div>
                        <p className="text-white text-lg md:text-xl leading-relaxed font-medium">
                            To make link sharing smarter, faster, and more impactful for everyone, everywhere. Join thousands of creators, entrepreneurs, and businesses who trust Devalyze to simplify their digital connections — one smart link at a time.
                        </p>
                    </div>
                </motion.div>

                {/* Vision Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mb-8"
                >
                    <div className="bg-[#6363F1] rounded-[20px] p-8 md:p-12 shadow-lg">
                        <div className="flex items-start gap-4 mb-4">
                            <Eye className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                Our Vision
                            </h2>
                        </div>
                        <p className="text-white text-lg md:text-xl leading-relaxed font-medium">
                            To become the most trusted and innovative link management platform in Africa and beyond, helping millions of users transform how they share and connect online.
                        </p>
                    </div>
                </motion.div>

                {/* Values Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="bg-[#6363F1] rounded-[20px] p-8 md:p-12 shadow-lg">
                        <div className="flex items-start gap-4 mb-4">
                            <Heart className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                Our Values
                            </h2>
                        </div>
                        <p className="text-white text-lg md:text-xl leading-relaxed font-medium">
                            Our work is guided by innovation, as we constantly seek smarter, faster ways to simplify link management. We stand on trust, ensuring that every link is secure, reliable, and transparent. We believe in simplicity, making complex technology easy and accessible for everyone. With a strong customer-first mindset, we listen, support, and deliver value that helps our users succeed. And through our passion for growth, we strive to help individuals and brands expand their digital reach effortlessly.
                        </p>
                    </div>
                </motion.div>

                {/* Optional: Team or CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <p className="text-gray-700 text-lg mb-6">
                        Join us on our journey to revolutionize link management
                    </p>
                    <Link to={'/SignUp'} className="px-8 py-4 bg-[#6363F1] text-white font-semibold rounded-lg hover:bg-[#5252E0] transition-colors duration-300 shadow-lg hover:shadow-xl">
                        Get in Touch
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

export default About;