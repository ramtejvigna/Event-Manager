import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

function EventDetails() {
    const location = useLocation();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { title } = useParams();
    const socket = useSocket();
    const { user } = useAuth();

    const id = location.state.event._id;


    useEffect(() => {
        loadEvent();

        if (socket) {
            socket.emit('joinEvent', id);

            socket.on('attendeeJoined', (data) => {
                setEvent(prev => ({
                    ...prev,
                    attendees: [...prev.attendees, data.attendee]
                }));
            });

            socket.on('attendeeLeft', (data) => {
                setEvent(prev => ({
                    ...prev,
                    attendees: prev.attendees.filter(a => a._id !== data.attendeeId)
                }));
            });
        }

        return () => {
            if (socket) {
                socket.emit('leaveEvent', id);
                socket.off('attendeeJoined');
                socket.off('attendeeLeft');
            }
        };
    }, [id, socket]);

    const loadEvent = () => {
        setLoading(true);
        const eventDetails = location.state && location.state.event;
        if(!eventDetails) {
            setError('Failed to fetch event');
        } else {
            setEvent(eventDetails);
        }
        setLoading(false);
    }

    const handleJoinEvent = async () => {
        try {
            await api.post(`/api/events/${id}/join`);
            loadEvent();
            socket.emit('attendeeJoined', { eventId: id, attendee: user });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join event');
        }
    };

    const handleLeaveEvent = async () => {
        try {
            await api.post(`/api/events/${id}/leave`);
            loadEvent();
            socket.emit('attendeeLeft', { eventId: id, attendeeId: user._id });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to leave event');
        }
    };

    const isUserAttending = () => {
        return event?.attendees.some(attendee => attendee._id === user?._id);
    };

    const isEventFull = () => {
        return event?.capacity && event.attendees.length >= event.capacity;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    if (!event) {
        return <div>Event not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {event.imageUrl && (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-64 object-cover"
                    />
                )}

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                            <p className="mt-1">
                                {new Date(event.date).toLocaleDateString()} at{' '}
                                {new Date(event.date).toLocaleTimeString()}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Location</h3>
                            <p className="mt-1">{event.location}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Category</h3>
                            <p className="mt-1 capitalize">{event.category}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                            <p className="mt-1">
                                {event.attendees.length} / {event.capacity || 'Unlimited'}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Attendees</h3>
                        <div className="flex flex-wrap gap-2">
                            {event.attendees.map(attendee => (
                                <span
                                    key={attendee._id}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
                                >
                                    {attendee.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {user && (
                        <div className="flex justify-end">
                            {isUserAttending() ? (
                                <button
                                    onClick={handleLeaveEvent}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Leave Event
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoinEvent}
                                    disabled={isEventFull()}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isEventFull() ? 'Event Full' : 'Join Event'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventDetails;