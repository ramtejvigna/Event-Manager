import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Home,
    LogIn,
    LogOut,
    UserPlus,
    Calendar,
    PlusCircle,
    Layout,
    Menu,
    X
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="shadow-xl">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 transform transition-transform duration-200 hover:scale-105"
                    >
                        <Calendar className="h-6 w-6" />
                        <span className="text-xl font-bold">EventPlanner</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-200"
                                >
                                    <Layout className="h-5 w-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/create-event"
                                    className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-200"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    <span>Create Event</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white transform transition-all duration-200 hover:bg-red-600 hover:scale-105 hover:shadow-lg"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-200"
                                >
                                    <LogIn className="h-5 w-5" />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-indigo-600 transform transition-all duration-200 hover:bg-opacity-90 hover:scale-105 hover:shadow-lg"
                                >
                                    <UserPlus className="h-5 w-5" />
                                    <span>Register</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-black p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-4 space-y-3">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-2 text-black p-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                                >
                                    <Layout className="h-5 w-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/create-event"
                                    className="flex items-center space-x-2 text-black p-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    <span>Create Event</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-2 w-full text-left text-white p-3 rounded-lg bg-red-500 hover:bg-red-600 transition-colors duration-200"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 text-white p-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                                >
                                    <LogIn className="h-5 w-5" />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center space-x-2 text-white p-3 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200"
                                >
                                    <UserPlus className="h-5 w-5" />
                                    <span>Register</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;