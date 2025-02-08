import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  Loader2, 
  UserPlus, 
  UserMinus, 
  AlertCircle,
  Clock,
  Share2,
  MessageCircle
} from 'lucide-react';
import api from '../../services/api';

function EventDetails() {
    const location = useLocation();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
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
                    attendees: prev.attendees.filter(a => a !== data.attendeeId)
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
            setActionLoading(true);
            await api.post(`/api/events/${id}/join`);
            loadEvent();
            socket.emit('attendeeJoined', { eventId: id, attendee: user });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join event');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeaveEvent = async () => {
        try {
            setActionLoading(true);
            await api.post(`/api/events/${id}/leave`);
            loadEvent();
            socket.emit('attendeeLeft', { eventId: id, attendeeId: user.id });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to leave event');
        } finally {
            setActionLoading(false);
        }
    };

    const isUserAttending = () => {
        return event?.attendees.some(attendee => attendee === user?.id);
    };

    const isEventFull = () => {
        return event?.capacity && event.attendees.length >= event.capacity;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Event Not Found</h2>
                    <p className="text-gray-600">The event you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                    {/* Event Image */}
                    <div className="relative h-72 w-full">
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-sm mb-4">
                                <Tag className="w-4 h-4 mr-2" />
                                {event.category}
                            </div>
                            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Clock className="w-5 h-5 mr-3 text-blue-500" />
                                    <span>{formatTime(event.date)}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Users className="w-5 h-5 mr-3 text-blue-500" />
                                    <span>{event.attendees.length} / {event.capacity || '∞'} attendees</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-end space-x-4">
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        title="Share Event"
                                    >
                                        <Share2 className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        title="Discussion"
                                    >
                                        <MessageCircle className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                                
                                {!isUserAttending() ? (
                                    <button
                                        onClick={handleJoinEvent}
                                        disabled={actionLoading || isEventFull()}
                                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                                            isEventFull() 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {actionLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5 mr-2" />
                                                {isEventFull() ? 'Event Full' : 'Join Event'}
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleLeaveEvent}
                                        disabled={actionLoading}
                                        className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium bg-red-500 hover:bg-red-600 transition-all duration-200"
                                    >
                                        {actionLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <UserMinus className="w-5 h-5 mr-2" />
                                                Leave Event
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">About this event</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">Organizer</h2>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-gray-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-gray-900">Event Organizer</p>
                                    <p className="text-sm text-gray-500">Joined {formatDate(event.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;