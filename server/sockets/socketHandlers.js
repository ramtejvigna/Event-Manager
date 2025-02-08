export default (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Handle joining an event
        socket.on('joinEvent', async (data) => {
            try {
                const { eventId, userId } = data;
                await socket.join(eventId);
                
                // Broadcast to all clients including sender
                io.emit('eventUpdated', {
                    type: 'JOIN',
                    eventId,
                    userId
                });
                
                console.log(`User ${userId} joined event ${eventId}`);
            } catch (error) {
                console.error('Error in joinEvent:', error);
            }
        });

        // Handle leaving an event
        socket.on('leaveEvent', async (data) => {
            try {
                const { eventId, userId } = data;
                await socket.leave(eventId);
                
                // Broadcast to all clients including sender
                io.emit('eventUpdated', {
                    type: 'LEAVE',
                    eventId,
                    userId
                });
                
                console.log(`User ${userId} left event ${eventId}`);
            } catch (error) {
                console.error('Error in leaveEvent:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};