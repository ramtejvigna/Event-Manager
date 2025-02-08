// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // Only connect to socket if user is authenticated
        if (user) {
            // Create socket connection
            const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
                auth: {
                    token: localStorage.getItem('token')
                },
                transports: ['websocket'],
                // Reconnection options
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            // Socket event listeners
            newSocket.on('connect', () => {
                console.log('Socket connected');
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);

                // Attempt to reconnect if disconnected due to network issues
                if (reason === 'io server disconnect') {
                    newSocket.connect();
                }
            });

            // Store socket instance
            setSocket(newSocket);

            // Cleanup on unmount
            return () => {
                if (newSocket) {
                    newSocket.disconnect();
                }
            };
        } else {
            // Disconnect socket if user logs out
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user]);

    // Custom emit function with error handling
    const safeEmit = (eventName, data) => {
        if (socket && socket.connected) {
            socket.emit(eventName, data);
            return true;
        }
        console.warn('Socket not connected, event not emitted:', eventName);
        return false;
    };

    return (
        <SocketContext.Provider value={{ socket, safeEmit }}>
            {children}
        </SocketContext.Provider>
    );
}

// Custom hook for using socket
export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context.socket;
}

// Custom hook for using safe emit
export function useSocketEmit() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocketEmit must be used within a SocketProvider');
    }
    return context.safeEmit;
}

export default SocketContext;