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