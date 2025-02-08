export default (io) => {
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('joinEvent', (eventId) => {
            socket.join(eventId);
        });

        socket.on('leaveEvent', (eventId) => {
            socket.leave(eventId);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
