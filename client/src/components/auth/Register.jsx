import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import api from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            const response = await api.post('/api/auth/register', formData);
            const userData = response.data.user;
            const token = response.data.jwtToken;
            await login(userData, token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to create account');
        }
    };

    return (
        <div className="min-h-[35rem] flex items-center justify-center">
            <div className="w-full max-w-md transform transition-all duration-300">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="space-y-4">
                            <div className="w-full flex justify-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#143D60] to-[#2D336B] rounded-full flex items-center justify-center transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#143D60] to-[#2D336B] bg-clip-text text-transparent">
                                Create Account
                            </h2>
                            <p className="text-sm text-center text-gray-500">
                                Fill in your details to create your account
                            </p>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-shake">
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Name Input */}
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-blue-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-0 border border-gray-200 rounded-xl pointer-events-none transition-all duration-200 group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-100 opacity-0 group-focus-within:opacity-100" />
                                </div>

                                {/* Email Input */}
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-blue-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-0 border border-gray-200 rounded-xl pointer-events-none transition-all duration-200 group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-100 opacity-0 group-focus-within:opacity-100" />
                                </div>

                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-blue-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-blue-500" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full relative group mt-6"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#143D60] to-[#2D336B] rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                                <div className="relative flex items-center justify-center space-x-2 bg-gradient-to-r from-[#143D60] to-[#2D336B] py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                                    <span className="text-white font-medium">Create Account</span>
                                    <ArrowRight className="w-5 h-5 text-white transform transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Animated background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>
        </div>
    );
};

export default Register;