import React from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Users,
    Search,
    Bell,
    Clock,
    Share2,
    Award,
    Zap
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
                <div className="text-center space-y-8 mb-16">
                    <div className="flex justify-center mb-6">
                        <Calendar className="h-16 w-16 text-indigo-600 animate-bounce" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Elevate Your Events
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Transform your ideas into unforgettable experiences. Plan, manage, and
                        host events that leave lasting impressions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/create-event"
                            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        >
                            <Zap className="h-5 w-5" />
                            <span>Create Event</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center space-x-2 bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        >
                            <Search className="h-5 w-5" />
                            <span>Explore Events</span>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
                    {/* Feature 1 */}
                    <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
                        <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Real-time Planning</h3>
                        <p className="text-gray-600">
                            Plan your events with real-time updates and collaborative tools that keep everyone in sync.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
                        <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                        <p className="text-gray-600">
                            Work seamlessly with your team, assign tasks, and track progress in one place.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
                        <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Bell className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
                        <p className="text-gray-600">
                            Stay updated with intelligent notifications and reminders for your events.
                        </p>
                    </div>
                </div>
                
                {/* Call to Action */}
                <div className="mt-20 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Create Your Next Event?</h2>
                    <p className="text-lg mb-6 opacity-90">
                        Join thousands of event planners who trust our platform
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center space-x-2 bg-white text-indigo-600 px-8 py-3 rounded-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        <Award className="h-5 w-5" />
                        <span>Get Started for Free</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;