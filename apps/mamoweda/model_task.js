const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    assignedToUser0: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: ['master', 'month', 'week', 'day', 'done'],
        default: 'other'
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
