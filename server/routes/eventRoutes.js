import express from "express"
import { createEvent, getEvents, joinEvent, leaveEvent } from "../controllers/eventController.js"
import authenticateToken from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post('/', authenticateToken, createEvent);
router.get('/', getEvents);
router.post('/:id/join', authenticateToken, joinEvent);
router.post('/:id/leave', authenticateToken, leaveEvent);

export default router;