import express from "express"
import { createEvent, getEvents } from "../controllers/eventController.js"
import authenticateToken from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post('/', authenticateToken, createEvent);
router.get('/', getEvents);

export default router;