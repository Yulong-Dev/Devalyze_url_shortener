import React from 'react';
import { motion } from 'framer-motion';
import { Link2, LayoutDashboard, QrCode, BarChart3 } from 'lucide-react';

function Services() {
    const services = [
        {
            icon: Link2,
            title: 'URL Shortening',
            description: 'Turn long, messy links into clean, branded URLs that are easy to share and remember. Perfect for social media, emails, and marketing campaigns.',
            delay: 0,
        },
        {
            icon: LayoutDashboard,
            title: 'Link Management Dashboard',
            description: 'Organize all your links in one smart dashboard. Edit, track, and manage your URLs effortlessly — anytime, anywhere.',
            delay: 0.1,
        },
        {
            icon: QrCode,
            title: 'QR Code Generation',
            description: 'Instantly create dynamic QR codes for your links, products, or campaigns. Share them and connect your audience online — one scan at a time.',
            delay: 0.2,
        },
        {
            icon: BarChart3,
            title: 'Link Tracking & Analytics',
            description: "Get real-time insights on who's clicking your links, from where, and when. Make data-driven decisions and measure your digital impact.",
            delay: 0.3,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <div className="min-h-screen bg-[#2D2D2D] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold text-[#6363F1] mb-4">
                        Our Services
                    </h1>
                    <div className="w-32 h-1 bg-[#6363F1] mx-auto"></div>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
                >
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    transition: { duration: 0.3 },
                                }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-[#6363F1]/10 rounded-full flex items-center justify-center">
                                        <Icon className="w-10 h-10 text-[#6363F1]" strokeWidth={2} />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 text-center leading-relaxed text-base">
                                    {service.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <p className="text-white text-lg mb-6">
                        Ready to transform your link management?
                    </p>
                    <button className="px-8 py-4 bg-[#6363F1] text-white font-semibold rounded-lg hover:bg-[#5252E0] transition-colors duration-300 shadow-lg hover:shadow-xl">
                        Get Started Free
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default Services;