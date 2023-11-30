const mongoose = require('mongoose')

// Define a Mongoose schema for your "courses" collection
const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    coursePeriod: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Course', courseSchema)