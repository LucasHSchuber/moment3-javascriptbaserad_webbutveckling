require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')


// Connect to MongoDB
mongoose.connect(process.env.DATABSE_URL)
const db = mongoose.connection
db.on('error',(error) => console.log(error))
db.once('open',() => console.log('Connected to Database'))

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

// Create a Mongoose model based on the schema
const Course = mongoose.model('Course', courseSchema);

// Create indexes on the "courses" collection
Course.createIndexes([{ key: { courseId: 1 }, options: { unique: true } }]);

// Set up a route to fetch and display courses
app.get('/courses', async (req, res) => {
  try {
    // Fetch all courses from the "courses" collection
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(3000, () => console.log("Server Started"))