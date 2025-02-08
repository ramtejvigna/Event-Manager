import express from "express"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import { Server } from "socket.io"
import socketHandlers from "./sockets/socketHandlers.js"

dotenv.config();

const app = express();
const server = http.createServer(app);

const origins = ["https://event-manager-tau-ecru.vercel.app", "http://localhost:5174"]

const io = new Server(server, {
    cors: {
        origin: origins,
        methods: ["GET", "POST"],
    },
});

connectDB();

// Middlewares
app.use(cors({
    origin: origins,
    methods: ["GET", "POST"],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

socketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));