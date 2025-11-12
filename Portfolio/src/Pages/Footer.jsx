/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const [hoveredLink, setHoveredLink] = useState(null);
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Mouse position tracking for parallax effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springConfig = { damping: 30, stiffness: 200 };
    const cursorX = useSpring(useTransform(mouseX, [0, window.innerWidth], [-10, 10]), springConfig);
    const cursorY = useSpring(useTransform(mouseY, [0, window.innerHeight], [-10, 10]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => setIsSubscribed(false), 3000);
            setEmail('');
        }
    };

    const footerSections = [
        {
            title: 'Navigation',
            links: [
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Portfolio', path: '/portfolio' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact', path: '/contact' },
            ]
        },
        {
            title: 'Connect',
            links: [
                { name: 'LinkedIn', url: 'https://linkedin.com/in/yourname' },
                { name: 'GitHub', url: 'https://github.com/yourname' },
                { name: 'Twitter', url: 'https://twitter.com/yourname' },
                { name: 'Dribbble', url: 'https://dribbble.com/yourname' },
            ]
        },
        {
            title: 'Resources',
            links: [
                { name: 'Resume', path: '/resume' },
                { name: 'Services', path: '/services' },
                { name: 'Testimonials', path: '/testimonials' },
                { name: 'Privacy Policy', path: '/privacy' },
            ]
        }
    ];

    const socialLinks = [
        {
            name: 'LinkedIn',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            ),
            url: 'https://linkedin.com/in/yourname',
            gradient: 'from-blue-600 to-blue-800'
        },
        {
            name: 'GitHub',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            ),
            url: 'https://github.com/yourname',
            gradient: 'from-purple-600 to-purple-900'
        },
        {
            name: 'Twitter',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
            ),
            url: 'https://twitter.com/yourname',
            gradient: 'from-cyan-500 to-blue-500'
        },
        {
            name: 'Email',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
            ),
            url: 'mailto:your.email@example.com',
            gradient: 'from-amber-500 to-red-500'
        }
    ];

    const FloatingOrb = ({ delay = 0 }) => (
        <motion.div
            className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-sm"
            initial={{ 
                opacity: 0,
                scale: 0,
                y: 100
            }}
            animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
                y: [100, -100, -200]
            }}
            transition={{
                duration: 4,
                delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeOut"
            }}
        />
    );

    return (
        <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black text-beige-100 border-t border-amber-500/20 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <FloatingOrb key={i} delay={i * 0.3} />
                ))}
                
                {/* Gradient Orbs */}
                <motion.div
                    className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-48 -right-48 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Mouse-aware parallax container */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY
                }}
                className="relative z-10"
            >
                {/* Main Footer Content */}
                <div className="container mx-auto px-6 py-16 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="lg:col-span-1"
                        >
                            <motion.div
                                className="inline-block mb-6"
                                whileHover={{ 
                                    scale: 1.05,
                                    rotate: [0, -5, 5, 0]
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.h3
                                    className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 bg-clip-text text-transparent"
                                    animate={{
                                        backgroundPosition: ['0%', '100%', '0%']
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    style={{
                                        backgroundSize: '200% 100%'
                                    }}
                                >
                                    Portfolio
                                </motion.h3>
                            </motion.div>
                            
                            <motion.p
                                className="text-beige-200 mb-8 leading-relaxed text-lg"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Creating beautiful digital experiences with passion and precision. 
                                Let's build something amazing together.
                            </motion.p>
                            
                            {/* Animated Social Links */}
                            <div className="flex space-x-3">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        whileHover={{ 
                                            scale: 1.3,
                                            y: -8,
                                            rotate: 360
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 17,
                                            delay: index * 0.1
                                        }}
                                        className={`relative p-3 rounded-2xl bg-gradient-to-br ${social.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 group`}
                                    >
                                        {social.icon}
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl bg-white/20"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileHover={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Footer Sections with Staggered Animation */}
                        {footerSections.map((section, sectionIndex) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: sectionIndex * 0.2 }}
                                className="relative"
                            >
                                <motion.h4
                                    className="font-bold text-xl mb-6 text-amber-300 relative inline-block"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {section.title}
                                    <motion.div
                                        className="absolute -bottom-2 left-0 w-0 h-0.5 bg-amber-500"
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    />
                                </motion.h4>
                                
                                <ul className="space-y-4">
                                    {section.links.map((link, linkIndex) => (
                                        <motion.li
                                            key={link.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: linkIndex * 0.1 }}
                                            onMouseEnter={() => setHoveredLink(link.name)}
                                            onMouseLeave={() => setHoveredLink(null)}
                                            className="relative"
                                        >
                                            {link.path ? (
                                                <motion.button
                                                    onClick={() => handleNavigation(link.path)}
                                                    whileHover={{ 
                                                        x: 10,
                                                        color: '#fbbf24'
                                                    }}
                                                    className="text-beige-200 hover:text-amber-300 transition-all duration-300 text-left text-lg font-medium flex items-center group"
                                                >
                                                    <motion.span
                                                        className="mr-2 opacity-0 group-hover:opacity-100"
                                                        animate={{ 
                                                            rotate: hoveredLink === link.name ? 360 : 0 
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        →
                                                    </motion.span>
                                                    {link.name}
                                                </motion.button>
                                            ) : (
                                                <motion.a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ 
                                                        x: 10,
                                                        color: '#fbbf24'
                                                    }}
                                                    className="text-beige-200 hover:text-amber-300 transition-all duration-300 text-lg font-medium flex items-center group"
                                                >
                                                    <motion.span
                                                        className="mr-2 opacity-0 group-hover:opacity-100"
                                                        animate={{ 
                                                            rotate: hoveredLink === link.name ? 360 : 0 
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        ↗
                                                    </motion.span>
                                                    {link.name}
                                                </motion.a>
                                            )}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Enhanced Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="mt-16 pt-12 border-t border-amber-500/30 relative"
                    >
                        <AnimatePresence>
                            {isSubscribed && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0, y: -50 }}
                                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg"
                                >
                                    🎉 Welcome to the inner circle!
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex flex-col lg:flex-row items-center justify-between">
                            <div className="mb-8 lg:mb-0 text-center lg:text-left">
                                <motion.h4
                                    className="font-bold text-3xl mb-4 bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Stay in the Loop
                                </motion.h4>
                                <motion.p
                                    className="text-beige-200 text-lg"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Get exclusive updates on my latest projects and creative adventures.
                                </motion.p>
                            </div>
                            
                            <motion.form
                                onSubmit={handleSubscribe}
                                className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative"
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.05 }}
                                >
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="px-6 py-4 rounded-2xl bg-black/50 backdrop-blur-sm border-2 border-amber-500/30 text-beige-100 placeholder-beige-200 focus:outline-none focus:border-amber-500 transition-all duration-300 flex-1 text-lg w-full sm:w-80"
                                        required
                                    />
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-amber-500/20 to-purple-500/20 -z-10"
                                        animate={{
                                            backgroundPosition: ['0%', '100%', '0%']
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                        style={{
                                            backgroundSize: '200% 100%'
                                        }}
                                    />
                                </motion.div>
                                
                                <motion.button
                                    type="submit"
                                    whileHover={{ 
                                        scale: 1.1,
                                        boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.6)",
                                        background: "linear-gradient(45deg, #f59e0b, #fbbf24, #f59e0b)"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 whitespace-nowrap text-lg relative overflow-hidden group"
                                >
                                    <motion.span
                                        className="relative z-10"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        Join the Journey
                                    </motion.span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </motion.button>
                            </motion.form>
                        </div>
                    </motion.div>
                </div>

                {/* Enhanced Bottom Bar */}
                <motion.div
                    className="border-t border-amber-500/20 relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                >
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <motion.div
                                className="flex items-center space-x-2 mb-4 md:mb-0"
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    className="w-2 h-2 bg-amber-500 rounded-full"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [1, 0.5, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <motion.p
                                    className="text-beige-200 text-sm"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                >
                                    © {currentYear} Portfolio. Crafted with passion and too much coffee.
                                </motion.p>
                            </motion.div>
                            
                            <div className="flex space-x-8">
                                {['Privacy Policy', 'Terms of Service'].map((item, index) => (
                                    <motion.button
                                        key={item}
                                        whileHover={{ 
                                            scale: 1.1,
                                            color: '#fbbf24',
                                            y: -2
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleNavigation(`/${item.toLowerCase().replace(' ', '')}`)}
                                        className="text-beige-200 hover:text-amber-300 transition-all duration-300 text-sm font-medium relative"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {item}
                                        <motion.div
                                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500"
                                            whileHover={{ width: '100%' }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default Footer;