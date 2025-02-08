import Event from "../models/Event.js"

export const createEvent = async (req, res) => {
    try {
        const event = new Event({ ...req.body, creator: req.user.id });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEvents = async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;
        let query = {};

        if (category) query.category = category;
        if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

        const events = await Event.find(query).populate('creator', 'name email').sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const joinEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.attendees.some(attendee => attendee.toString() === userId)) {
            return res.status(400).json({ message: 'User already joined the event' });
        }

        if (event.capacity && event.attendees.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        event.attendees.push(userId);
        await event.save();

        res.status(200).json({ message: 'Joined event successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const leaveEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(id).populate('attendees');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!event.attendees.some(attendee => attendee._id.toString() === userId)) {
            return res.status(400).json({ message: 'User is not part of this event' });
        }

        event.attendees = event.attendees.filter(attendee => attendee._id.toString() !== userId);
        await event.save();

        res.status(200).json({ message: 'Left event successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};