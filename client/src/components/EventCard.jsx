import { useSocket } from '../contexts/SocketContext';
import { useEffect, useState } from 'react';

const EventCard = ({ event, handleEventClick }) => {
    const { title, description, date, location, imageUrl, attendees } = event;
    const [currentAttendees, setCurrentAttendees] = useState(event.attendees);
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleEventUpdate = (data) => {
            if (data.eventId === event._id) {
                setCurrentAttendees(prev => {
                    if (data.type === 'JOIN') {
                        return [...new Set([...prev, data.userId])];
                    } else if (data.type === 'LEAVE') {
                        return prev.filter(id => id !== data.userId);
                    }
                    return prev;
                });
            }
        };

        socket.on('eventUpdated', handleEventUpdate);

        return () => {
            socket.off('eventUpdated', handleEventUpdate);
        };
    }, [socket, event._id]);

    return (
        <div 
            onClick={() => handleEventClick(event)}
            className="bg-white h-full rounded-lg shadow-md overflow-hidden cursor-pointer">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-600 mt-2">{description}</p>
                <div className="mt-4 space-y-2">
                    <p className="text-sm">
                        <span className="font-medium">Date:</span> {new Date(date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Location:</span> {location}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Attendees:</span> {currentAttendees.length}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EventCard;