import React, { useEffect, useState } from "react";
import { FaFlag, FaSignOutAlt } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from "../constants/LocalStorageKey";

const Template = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuItems = [
        { title: "Challenges", icon: <FaFlag />, url: "/topics" },
        { title: "Score Board", icon: <FaRankingStar />, url: "/rankings" },
        { title: "Ticket", icon: <IoTicket />, url: "/tickets" }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        console.log("Logout button clicked"); // Check if this logs
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    navigate('/login');
    };

    useEffect(() => {
        if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0 w-1/4">
                            <img
                                className="h-8 w-auto"
                                src="/fctf-logo.png"
                                alt="Logo"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/fctf-logo.png";
                                }}
                            />
                        </div>

                        <div className="hidden md:flex flex-1 justify-center">
                            <div className="flex items-center space-x-4">
                                {menuItems.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigate(item.url)}
                                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-theme-color-primary hover:text-theme-color-primary-dark hover:bg-primary-low transition-all duration-300"
                                    >
                                        <span className="mr-2 text-lg">{item.icon}</span>
                                        {item.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="hidden md:flex w-1/4 justify-end">
                            <button onClick={handleLogout} className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-theme-color-primary hover:bg-theme-color-primary-dark transition-all duration-300">
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>

                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-theme-color-primary hover:text-theme-color-primary-dark"
                            >
                                <svg
                                    className={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg
                                    className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden"}`}>
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-theme-color-primary hover:text-theme-color-primary-dark hover:bg-primary-low transition-all duration-300"
                                >
                                    <span className="mr-2 text-lg">{item.icon}</span>
                                    {item.title}
                                </button>
                            ))}
                            <button  className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-white bg-theme-color-primary hover:bg-theme-color-primary-dark transition-all duration-300">
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow bg-gradient-to-b from-primary-low to-white">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <footer className="bg-white shadow-lg mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4">
                    <p className="text-center text-theme-color-primary font-medium hover:text-theme-color-primary-dark transition-all duration-300">
                        Powered By F-CTF Team @2024
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Template;