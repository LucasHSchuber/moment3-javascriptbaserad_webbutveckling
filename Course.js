const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: String,
    name: String,
    syllabus: String,
    progression: String,
    termin: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
