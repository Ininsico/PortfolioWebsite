import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleHomeClick = () => {
        navigate('/');
        if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            <header
                className={`relative w-full z-50 transition-all duration-500 ${
                    isScrolled 
                        ? 'bg-black/80 backdrop-blur-xl border-b border-gray-800' 
                        : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        {/* Logo/Brand */}
                        <div
                            className="flex items-center space-x-3 cursor-pointer group"
                            onClick={handleHomeClick}
                        >
                            <div className="w-3 h-3 bg-white rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                            <div className={`text-2xl font-black tracking-tighter group-hover:scale-105 transition-transform duration-300 text-white`}>
                                PORTFOLIO
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center space-x-1">
                                {menuItems.map((item, index) => (
                                    <div
                                        key={item.name}
                                        className="relative"
                                    >
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className="font-bold px-6 py-3 rounded-full transition-all duration-500 relative overflow-hidden group"
                                        >
                                            <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
                                                {item.name}
                                            </span>
                                            
                                            <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center" />
                                        </button>
                                    </div>
                                ))}
                                
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="ml-4 px-8 py-3 rounded-full font-black transition-all duration-500 border-2 border-white text-white hover:bg-white hover:text-black"
                                >
                                    LOGIN
                                </button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-3 rounded-full lg:hidden transition-all duration-300 bg-white/10 text-white hover:bg-white/20"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                            <div className="relative">
                                <div className="space-y-4 text-center">
                                    {menuItems.map((item, index) => (
                                        <button
                                            key={item.name}
                                            onClick={() => handleNavigation(item.path)}
                                            className="block w-full text-4xl font-black text-white py-4 hover:scale-110 transition-transform duration-300"
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleNavigation('/login')}
                                        className="block w-full text-2xl font-black text-white py-6 mt-8 border-4 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        LOGIN
                                    </button>
                                </div>
                                
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="absolute top-0 right-0 -mt-20 -mr-4 p-4 text-white hover:scale-110 transition-transform duration-300"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;