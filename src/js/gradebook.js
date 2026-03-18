// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

const sampleData = {
    students: ["Ava", "Noah", "Mia", "Liam", "Zoe", "Ethan", "Ivy", "Sam", "Kai", "Emma"],
    assessments: ["Lab 1", "Lab 2", "Lab 3", "Midterm", "Final"],
    grades: [
        [92, 85, 88, 79, 91],
        [76, 81, 74, 69, 72],
        [88, 90, 84, 93, 86],
        [63, 58, 71, 66, 60],
        [95, 92, 97, 89, 94],
        [82, 77, 80, 74, 79],
        [70, 73, 68, 72, 75],
        [55, 61, 59, 63, 58],
        [84, 86, 83, 81, 85],
        [91, 88, 90, 87, 92]
    ]
};


// A function that converts your grade data into a structure that is easy to index by row and column.
// converting to a matrix
function gradesToMatrix(data) {
    return data.grades;
}