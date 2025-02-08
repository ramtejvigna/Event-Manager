import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import api from '../services/api';
import {
    PlusCircle,
    Calendar,
    Search,
    Filter,
    ListFilter,
    X
} from 'lucide-react';

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        startDate: '',
        endDate: ''
    });
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        loadEvents();

        if (socket) {
            socket.on('newEvent', (event) => {
                setEvents(prev => [event, ...prev]);
            });
        }

        return () => {
            if (socket) {
                socket.off('newEvent');
            }
        };
    }, [socket, filters]);

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/events', { params: filters });
            setEvents(response.data);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const slugify = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleEventClick = (event) => {
        const eventSlug = slugify(event.title);
        navigate(`/events/${eventSlug}`, {
            state: { event }
        });
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 " />
                        <h1 className="text-3xl font-bold">
                            Event Dashboard
                        </h1>
                    </div>

                    <Link
                        to="/create-event"
                        className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        <PlusCircle className="h-5 w-5" />
                        <span>Create Event</span>
                    </Link>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            <Filter className="h-5 w-5 text-gray-600" />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Categories</option>
                                <option value="conference">Conference</option>
                                <option value="workshop">Workshop</option>
                                <option value="meetup">Meetup</option>
                            </select>
                            <label htmlFor="startDate">Start Date: </label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                            <label htmlFor="endDate">End Date: </label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    )}
                </div>

                {/* Events Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <div
                                key={event._id}
                                className="transform transition-all duration-200 hover:scale-[1.02]"
                            >
                                <EventCard handleEventClick={handleEventClick} event={event} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <ListFilter className="h-12 w-12 mb-4" />
                        <p className="text-xl">No events found</p>
                        <p className="text-sm">Try adjusting your filters or search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDashboard;