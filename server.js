"use strict";

const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

const courses =
  [{ "_id": 1, "courseId": "DT162G", "courseName": "Javascript-baserad webbutveckling", "coursePeriod": 1 }, { "_id": 2, "courseId": "IK060G", "courseName": "Projektledning", "coursePeriod": 1 }, { "_id": 3, "courseId": "DT071G", "courseName": "Programmering i C#.NET", "coursePeriod": 2 }, { "_id": 4, "courseId": "DT148G", "courseName": "Webbutveckling för mobila enheter", "coursePeriod": 2 }, { "_id": 5, "courseId": "DT102G", "courseName": "ASP.NET med C#", "coursePeriod": 3 }, { "_id": 6, "courseId": "IG021G", "courseName": "Affärsplaner och kommersialisering", "coursePeriod": 3 }, { "_id": 7, "courseId": "DT069G", "courseName": "Multimedia för webben", "coursePeriod": 4 }, { "_id": 8, "courseId": "DT080G", "courseName": "Självständigt arbete", "coursePeriod": 4 }]
  ;

app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.post('/api/reload', (req, res) => {

  courses = [
    { "_id": 1, "courseId": "DT162G", "courseName": "Javascript-baserad webbutveckling", "coursePeriod": 1 },
    { "_id": 2, "courseId": "IK060G", "courseName": "Projektledning", "coursePeriod": 1 },
    { "_id": 3, "courseId": "DT071G", "courseName": "Programmering i C#.NET", "coursePeriod": 2 },
    { "_id": 4, "courseId": "DT148G", "courseName": "Webbutveckling för mobila enheter", "coursePeriod": 2 },
    { "_id": 5, "courseId": "DT102G", "courseName": "ASP.NET med C#", "coursePeriod": 3 },
    { "_id": 6, "courseId": "IG021G", "courseName": "Affärsplaner och kommersialisering", "coursePeriod": 3 },
    { "_id": 7, "courseId": "DT069G", "courseName": "Multimedia för webben", "coursePeriod": 4 },
    { "_id": 8, "courseId": "DT080G", "courseName": "Självständigt arbete", "coursePeriod": 4 }
  ];
  res.sendStatus(200);
});

app.delete('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);

  const courseIndex = courses.findIndex(course => course._id === courseId);

  if (courseIndex !== -1) {

    courses.splice(courseIndex, 1);
    res.sendStatus(200); 
  } else {
    res.status(404).json({ error: 'Course not found' }); 
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


