import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import api from '../../services/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', formData);
            const userData = response.data.user;
            const token = response.data.jwTtoken;
            await login(userData, token);
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-[35rem] flex  items-center justify-center">
            <div className="w-full max-w-md transform transition-all duration-300">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="space-y-4">
                            <div className="w-full flex justify-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Welcome Back
                            </h2>
                            <p className="text-sm text-center text-gray-500">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-shake">
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-blue-500" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <div className="absolute inset-0 border border-gray-200 rounded-xl pointer-events-none transition-all duration-200 group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-100 opacity-0 group-focus-within:opacity-100" />
                                </div>

                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-blue-500" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <div className="absolute inset-0 border border-gray-200 rounded-xl pointer-events-none transition-all duration-200 group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-100 opacity-0 group-focus-within:opacity-100" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full relative group"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                                <div className="relative flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                                    <span className="text-white font-medium">Sign in</span>
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
}

export default Login;
