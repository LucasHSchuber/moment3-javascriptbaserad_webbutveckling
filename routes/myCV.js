const express = require('express')
const router = express.Router()
const Course = require('../models/myCV')

//----------------------
//GETTING ALL POSTS
//---------------------_
router.get('/', async (req, res) => {

    try {
        const course = await Course.find()
        res.json(course)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


//----------------------
//GETTING ONE POST
//---------------------_

router.get('/:id', getCourse, (req, res) => {
    res.json(res.course)
})



//----------------------
//CREATING POST
//---------------------_

router.post('/', async (req, res) => {
    const course = new Course({
        courseId: req.body.courseId,
        courseName: req.body.courseName,
        coursePeriod: req.body.coursePeriod
    })
    try {
        const newCourse = await course.save()
        res.status(201).json(newCourse)

    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})



//----------------------
//UPDATING
//----------------------

router.patch('/:id', getCourse, async (req, res) => {
    if (req.body.courseId != null) {
        res.course.courseId = req.body.courseId
    }
    if (req.body.courseName != null) {
        res.course.courseName = req.body.courseName
    }
    if (req.body.coursePeriod != null) {
        res.course.coursePeriod = req.body.coursePeriod
    }

    try {
        const updatedCourse = await res.course.save()
        res.json(updatedCourse)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})



//----------------------
//DELETING
//----------------------

router.delete('/:id', getCourse, async (req, res) => {
    try {
        await res.course.deleteOne()
        res.json({ message: "Course Deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})




//getCourse method
async function getCourse(req, res, next) {
    try {
        course = await Course.findById(req.params.id)
        if (course == null) {
            return res.status(404).json({ message: "cannot find course" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.course = course
    next()
}


module.exports = router