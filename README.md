# Event Manager
#### Live Demo - [https://event-manager-tau-ecru.vercel.app/](https://event-manager-tau-ecru.vercel.app/)

## Overview
Event Manager is a full-stack event management platform that allows users to create, manage, and view events. The platform includes user authentication, real-time attendee updates, and event creation and management tools. It is built using the MERN stack and deployed on free-tier hosting services.

## Features
### Frontend:
- **User Authentication**: Users can register and log in, with an option for "Guest Login" to access limited features.
- **Event Dashboard**: Displays a list of upcoming and past events with filters for categories and dates.
- **Event Creation**: Users can create events with details like event name, description, date/time, and more.
- **Real-Time Attendee List**: Shows the number of attendees for each event in real-time.
- **Responsive Design**: Ensures a seamless experience on all devices.

### Backend:
- **Authentication API**: Uses JWT for secure authentication.
- **Event Management API**: Supports CRUD operations for events with ownership restrictions.
- **Real-Time Updates**: Implements WebSockets for real-time event updates.
- **Database**: Stores user and event data efficiently using MongoDB.

## Tech Stack
### Frontend:
- React.js
- Tailwind CSS
- Redux Toolkit (for state management)

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- WebSockets (Socket.io)
- JWT for authentication

## Installation
### Prerequisites:
- Node.js installed
- MongoDB set up locally or use MongoDB Atlas

### Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/event-manager.git
   cd event-manager
   ```

2. Install Dependencies
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```
   
3. Create a .env file in the server and client directories
   For Server:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
   For Client:
   ```sh
   VITE_SOCKET_URL=http://localhost:5000
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

4. Start the server:
   ```sh
   cd server
   npm start
   ```

5. Start the client
   ```sh
   cd client
   npm run dev
   ```
