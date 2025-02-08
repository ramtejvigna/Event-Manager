import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to EventPlanner
                </h1>
                <p className="text-xl text-gray-600">
                    Plan and manage your events with ease
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Create Events</h2>
                    <p className="text-gray-600 mb-4">
                        Easily create and manage your events with our intuitive interface.
                    </p>
                    <Link
                        to="/create-event"
                        className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Get Started
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Browse Events</h2>
                    <p className="text-gray-600 mb-4">
                        Discover and join events in your area or create your own.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        View Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;