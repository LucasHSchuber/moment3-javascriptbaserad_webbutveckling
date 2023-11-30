 "use strict";
 
 // Fetch courses from the server
 fetch('http://localhost:3000/courses')
 .then(response => response.json())
 .then(courses => {
   // Update the HTML with the received courses
   const coursesList = document.getElementById('courses-list');
   courses.forEach(course => {
     const li = document.createElement('li');
     li.textContent =
       `${course.courseId} - ${course.courseName} (Period ${course.coursePeriod})`;
     coursesList.appendChild(li);
   });
 })
 .catch(error => console.error('Error fetching courses:', error));