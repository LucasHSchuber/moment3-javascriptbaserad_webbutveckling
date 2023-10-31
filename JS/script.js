

//Skriv ut courses till DOM
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
                    <td><button class="del-btn delete" onClick="deleteCourse(${course._id})" data-id="${course._id}">Radera</button></td>
                </tr> `
            );
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });

    // const deleteButtons = document.querySelectorAll('.delete');


    // deleteButtons.forEach(button => {
    //     button.addEventListener('click', function() {
    //         // Retrieve the data-id attribute value of the clicked button
    //         const courseId = this.getAttribute('data-id');
    //         // Perform actions based on courseId, such as deleting the corresponding course
    //         deleteCourse(courseId);
    //     });
    // });
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


// function deleteCourse(courseId) {

//     fetch(`http://localhost:3000/api/courses/${courseId}`, {
//         method: "DELETE",
//         headers: {
//             "content-type": "application/json",
//         }
//     })
//         .then(Response => Response.json())
//         .then(data => {

//             console.log("workiiing!");
//         })
//         .catch(err => console.log(err))
// }


// async function deleteCourse(courseId) {
//     try {
//         const response = fetch(`http://localhost:3000/api/courses/${courseId}`, {
//             method: 'DELETE',
//         });

//         if (response.ok) {
//             console.log(`Course with ID ${courseId} deleted successfully.`);
//             getCourses(); // Uppdatera kurser efter borttagning
//         } else {
//             console.error(`Failed to delete course with ID ${courseId}.`);
//         }
//     } catch (error) {
//         console.error('Error deleting course:', error);
//     }
// }

getCourses();
