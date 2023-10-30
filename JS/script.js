function getCourses() {
    fetch('http://localhost:3000/api/courses')
        .then(response => response.json())
        .then(courses => {
            const coursesTable = document.getElementById('courses-table');

            coursesTable.innerHTML = courses.map(course => `
                <tr>
                    <td>${course.courseId}</td>
                    <td>${course.courseName}</td>
                    <td>${course.coursePeriod}</td>
                    <td><button class="del-btn" onClick="DeleteCourse(${course._id});">Radera</button></td>
                </tr> `
            );
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
}
function DeleteCourse(id) {
    console.log("deleted " + id);

    
    getCourses();
}

getCourses();
