

//Skriv ut courses till DOM
function getCourses() {
    fetch('http://localhost:3000/api/courses')
        .then(response => response.json())
        .then(courses => {
            const coursesTable = document.getElementById('courses-table');

            coursesTable.innerHTML = courses.map(course => 
                `<tr>
                    <td>${course.courseId}</td>
                    <td>${course.courseName}</td>
                    <td>${course.coursePeriod}</td>
                    <td><button class="del-btn delete" onClick="deleteCourse(${course._id})" data-id="${course._id}">Radera</button></td>
                </tr>`
            );
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
}

function deleteCourse(id) {

    console.log("working " + id);

    fetch(`http://localhost:3000/api/courses/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            //load alla courses id delete success
            getCourses();
            return response.json();
        })
        .then(data => {
            console.log("Course deleted successfully:", data);
            getCourses();
        })
        .catch(error => {
            console.error("Error deleting course:", error);
        });
}

// function reloadCourses() {

//     console.log("ok!");
//     fetch('http://localhost:3000/api/reload', {
//         method: 'POST',
//     })
//         .then(response => {
//             if (response.ok) {
//                 console.log('Courses reloaded successfully.');
//                 getCourses(); // Reload courses after the reload request
//             } else {
//                 console.error('Failed to reload courses.');
//             }
//         })
//         .catch(error => {
//             console.error('Error reloading courses:', error);
//         });
// }

getCourses();
