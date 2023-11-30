const express = require('express')
const router = express.Router()
const Course = require('../models/myCV')

//getting all
router.get('/', async (req, res) => {

    try {
        const course = await Course.find()
        res.json(course)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }


})


module.exports = router