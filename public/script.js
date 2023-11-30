"use strict";


loadCourses();

//FETCH COURSES FROM SERVER
function loadCourses() {

    fetch('http://localhost:3000/courses')
        .then(response => response.json())
        .then(courses => {

            const coursesList = document.getElementById('courses-list');

            //clear first
            coursesList.innerHTML = "";

            // Update the HTML with the received courses

            if (courses.length === 0) {
                console.log("No data found in mongoDB");

                coursesList.innerHTML = "No data found in mongoDB";
            }

            courses.forEach(course => {
                const li = document.createElement('li');
                li.textContent =
                    `${course.courseId} - ${course.courseName} (Period ${course.coursePeriod})`;

                const delbtn = document.createElement('button');
                delbtn.textContent = 'Delete';
                delbtn.classList.add('del-btn');
                delbtn.addEventListener('click', () => deleteCourse(course._id));

                li.appendChild(delbtn);
                coursesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching courses:', error));

}



//ADD COURSE TO SERVER
function addCourse() {
    const courseid = document.getElementById("courseId").value;
    const coursename = document.getElementById("courseName").value;
    const courseperiod = document.getElementById("coursePeriod").value;

    const messageId = document.getElementById("message_id");
    const messageName = document.getElementById("message_name");
    const messagePeriod = document.getElementById("message_period");


    if (courseid < 1) {
        messageId.innerHTML = "Course ID must contain at least 1 character"
    } else {
        messageId.innerHTML = "";
    }
    if (coursename < 1) {
        messageName.innerHTML = "Course Name must contain at least 1 character"
    } else {
        messageName.innerHTML = "";
    }
    if (courseperiod < 1) {
        messagePeriod.innerHTML = "Course Period must contain at least 1 character"
    } else {
        messagePeriod.innerHTML = "";
    }

    const data = {
        courseId: courseid,
        courseName: coursename,
        coursePeriod: courseperiod
    }

    fetch(`http://localhost:3000/courses`, {
        method: 'POST',
        headers: {
            'Content-type': "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to post course: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Course posted successfully:', data);
            //load all courses when posted
            loadCourses();
        })
        .catch(error => console.error('Error posting course:', error));
}



//DELETE COURSE FROM SERVER
function deleteCourse(courseId) {
    // Perform the delete request to your server
    fetch(`http://localhost:3000/courses/${courseId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete course: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Course deleted successfully:', data);
            //load all courses when deleted
            loadCourses();
        })
        .catch(error => console.error('Error deleting course:', error));
}


//ADD DATA TO SERVER
function addData() {

    const courseArray = [
        {
            courseId: "DT162G",
            courseName: "Javascript-baserad webbutveckling",
            coursePeriod: 1
        },
        {
            courseId: "IK060G",
            courseName: "Projektledning",
            coursePeriod: 1
        },
        {
            courseId: "DT071G",
            courseName: "Programmering i C#.NET",
            coursePeriod: 2
        },
        {
            courseId: "DT148G",
            courseName: "Webbutveckling för mobila enheter",
            coursePeriod: 2
        },
        {
            courseId: "DT102G",
            courseName: "ASP.NET med C#",
            coursePeriod: 3
        },
        {
            courseId: "IG021G",
            courseName: "Affärsplaner och kommersialisering",
            coursePeriod: 3
        },
        {
            courseId: "DT069G",
            courseName: "Multimedia för webben",
            coursePeriod: 4
        },
        {
            courseId: "DT080G",
            courseName: "Självständigt arbete",
            coursePeriod: 4
        }
    ];

    const random = courseArray[Math.floor(Math.random() * courseArray.length)];

    const data = {
        courseId: random.courseId,
        courseName: random.courseName,
        coursePeriod: random.coursePeriod
    }

    console.log(random.courseId);
    console.log(random.courseName);
    console.log(random.coursePeriod);
    console.log(random);

    // console.log(JSON.stringify(data)); // Log the payload for debugging
    fetch(`http://localhost:3000/courses`, {
        method: 'POST',
        headers: {
            'Content-type': "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to post course: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Course posted successfully:', data);
            //load all courses when posted
            loadCourses();
        })
        .catch(error => {
            console.error('Error adding courses:', error);
        });

}