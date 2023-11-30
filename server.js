require('dotenv').config()

const express = require('express')
const cors = require('cors'); // Import the cors package
const app = express()
const mongoose = require('mongoose')
// Use cors middleware
app.use(cors());

app.use(express.json())

const myCVRouter = require('./routes/myCV')
app.use('/courses', myCVRouter)


// Connect to MongoDB
mongoose.connect(process.env.DATABSE_URL)
const db = mongoose.connection
db.on('error',(error) => console.log(error))
db.once('open',() => console.log('Connected to Database'))


// Start the server
app.listen(3000, () => console.log("Server Started"))