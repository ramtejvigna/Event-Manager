import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    description: {
        type: String,
        required: true
    },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    capacity: { type: Number },
    createdAt: { type: Date, default: Date.now },
})

const Event = mongoose.model('Event', eventSchema);

export default Event;