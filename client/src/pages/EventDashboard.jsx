import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard'
import api from '../services/api';


const EventDashboard = () => {
    const [events, setEvents] = useState([]);
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
                setEvents(prev => [...prev, event]);
            });
        }

        return () => {
            if (socket) {
                socket.off('newEvent');
            }
        };
    }, [socket]);

    const loadEvents = async () => {
        try {
            const response = await api.get('/api/events', { params: filters });
            setEvents(response.data);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    const slugify = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleEventClick = (event) => {
        const eventSlug = slugify(event.title);

        navigate(`/events/${eventSlug}`, {
            state: { 
                event: event 
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Event Dashboard</h1>
                <Link
                    to="/create-event"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map(event => (
                    <EventCard handleEventClick={handleEventClick} key={event._id} event={event} />
                ))}
            </div>
        </div>
    );
}

export default EventDashboard;